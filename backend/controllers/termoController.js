import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Action from '../models/Action.js';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '../templates/Termo-Voluntário.docx');

const libreConvert = promisify(libre.convert.bind(libre));

// ── Helpers ────────────────────────────────────────────────────────

const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const fmtDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

const fmtMonthYear = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

// ── Schedule table X-mark injection ───────────────────────────────

// Returns {activityIndex: Set<monthIndex>} for O(1) lookups
const buildScheduleLookup = (schedule) => {
    const m = {};
    for (const { activityIndex, months } of (schedule || [])) {
        m[activityIndex] = new Set(months || []);
    }
    return m;
};

// Inserts <w:t>X</w:t> into an empty month cell.
// Template month cells have no <w:r> run — just <w:tcPr> + empty <w:p>.
// We add a run with X before </w:p>; if a run already exists, patch its <w:t>.
const insertX = (cellXml) => {
    if (!/<w:r\b/.test(cellXml)) {
        // No run at all — add one before closing paragraph
        return cellXml.replace(/<\/w:p>/, '<w:r><w:t xml:space="preserve">X</w:t></w:r></w:p>');
    }
    // Run exists but text is self-closing or empty
    if (/<w:t\s*\/>/.test(cellXml)) {
        return cellXml.replace(/<w:t\s*\/>/, '<w:t xml:space="preserve">X</w:t>');
    }
    if (/<w:t[^>]*><\/w:t>/.test(cellXml)) {
        return cellXml.replace(/<w:t([^>]*)><\/w:t>/, '<w:t$1>X</w:t>');
    }
    // Fallback: append X text element inside first run
    return cellXml.replace(/(<w:r\b[^>]*>)([\s\S]*?)(<\/w:r>)/, '$1$2<w:t xml:space="preserve">X</w:t>$3');
};

// Processes one activity row content — ci=0 before first cell, ci=1 label, ci>=2 month cells
// <w:tc> has no attributes in this template, so plain split is safe
const processActivityRow = (rowContent, markedMonths) => {
    const parts = rowContent.split('<w:tc>');
    return parts
        .map((cell, ci) => {
            if (ci === 0) return cell;
            const monthIdx = ci - 2; // ci=1 label, ci=2 → month 0
            if (ci >= 2 && markedMonths.has(monthIdx)) {
                return '<w:tc>' + insertX(cell);
            }
            return '<w:tc>' + cell;
        })
        .join('');
};

// Walks the full document XML, finds the schedule table, fills X marks.
// Uses regex for rows because <w:tr> elements have XML attributes in this template.
const fillSchedule = (xml, scheduleLookup) => {
    const T_OPEN = '<w:tbl>';
    const T_CLOSE = '</w:tbl>';
    let result = '';
    let pos = 0;

    while (pos < xml.length) {
        const tStart = xml.indexOf(T_OPEN, pos);
        if (tStart === -1) { result += xml.slice(pos); break; }
        const tEnd = xml.indexOf(T_CLOSE, tStart) + T_CLOSE.length;
        result += xml.slice(pos, tStart);
        const tbl = xml.slice(tStart, tEnd);

        if (!tbl.includes('ATIVIDADES')) {
            result += tbl;
        } else {
            // rows 3–6 (0-based) are activity rows 1–4
            let rowIndex = -1;
            result += tbl.replace(/(<w:tr\b[^>]*>)([\s\S]*?)(<\/w:tr>)/g, (match, openTag, rowContent, closeTag) => {
                rowIndex++;
                if (rowIndex >= 3 && rowIndex <= 6) {
                    const activityIdx = rowIndex - 3;
                    const marked = scheduleLookup[activityIdx] || new Set();
                    return openTag + processActivityRow(rowContent, marked) + closeTag;
                }
                return match;
            });
        }
        pos = tEnd;
    }
    return result;
};

// ── Modality helper ───────────────────────────────────────────────

const buildModalityStr = (modality) => {
    const opts = ['programa', 'projeto', 'evento', 'curso'];
    const sel = (modality || 'Projeto').toLowerCase();
    return 'Modalidade:     ' + opts.map(o => `(${o === sel ? ' x ' : '   '}) ${o}`).join('             ');
};

// ── Resolve userId (shared between DOCX and PDF endpoints) ────────

const resolveUserId = (req) => {
    let userId = req.usuario._id;
    if (req.query.userId && ['ADMIN', 'COORDENADOR'].includes(req.usuario.role)) {
        userId = req.query.userId;
    }
    return userId;
};

// ── Core: build the filled DOCX as a Buffer ───────────────────────

const buildDocxBuffer = async (userId) => {
    const [volunteer, action] = await Promise.all([
        User.findById(userId),
        Action.findOne().populate('coordinator'),
    ]);

    if (!volunteer) throw Object.assign(new Error('Voluntário não encontrado.'), { status: 404 });
    if (!action)    throw Object.assign(new Error('Dados da ação não encontrados.'), { status: 404 });

    const vd    = volunteer.volunteerData || {};
    const addr  = vd.address || {};
    const coord = action.coordinator;
    const coordD = coord?.coordinatorData || {};

    const today   = new Date();
    const todayFmt = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const periodStart = fmtMonthYear(vd.periodStart);
    const periodEnd   = fmtMonthYear(vd.periodEnd);

    // ── Load template ──────────────────────────────────────────
    const buf = fs.readFileSync(TEMPLATE_PATH);
    const zip = new PizZip(buf);
    let xml = zip.file('word/document.xml').asText();

    // ── Pre-processing (before docxtemplater) ─────────────────

    // 1. Cronograma period: replace COMPLETE {{Início}} and {{fim}} text nodes
    xml = xml.replace(/<w:t[^>]*>\{\{Início\}\}<\/w:t>/g,
        `<w:t xml:space="preserve">${escapeXml(periodStart)}</w:t>`);
    xml = xml.replace(/<w:t[^>]*>\{\{fim\}\}<\/w:t>/g,
        `<w:t xml:space="preserve">${escapeXml(periodEnd)}</w:t>`);

    // 2. Coordinator name: template has broken "{{nome" (no closing }})
    xml = xml.replace(/<w:t[^>]*>Nome: \{\{nome<\/w:t>/,
        `<w:t xml:space="preserve">Nome: ${escapeXml(coord?.name || '')}</w:t>`);

    // 3. Coordinator fields without placeholders
    xml = xml.replace(/(<w:t[^>]*>CPF: )(<\/w:t>)/,
        `$1${escapeXml(coord?.cpf || '')}$2`);
    xml = xml.replace(/(<w:t[^>]*>Departamento: )(<\/w:t>)/,
        `$1${escapeXml(coordD.department || '')}$2`);
    xml = xml.replace(/(<w:t[^>]*>Fone: )(<\/w:t>)/,
        `$1${escapeXml(coord?.phone || '')}$2`);
    xml = xml.replace(/(<w:t[^>]*>E-mail: )(<\/w:t>)/,
        `$1${escapeXml(coord?.email || '')}$2`);

    // 4. Action title
    xml = xml.replace(/(<w:t[^>]*>T[^<]{0,20}da a[^<]{0,5}o: )(<\/w:t>)/,
        `$1${escapeXml(action.title || '')}$2`);

    // 5. Modality: re-build the cell text marking the correct option
    xml = xml.replace(/<w:t[^>]*>Modalidade:[^<]*<\/w:t>/,
        `<w:t xml:space="preserve">${escapeXml(buildModalityStr(action.modality))}</w:t>`);

    // 6. Date field
    xml = xml.replace(/(<w:t[^>]*>Data: )(<\/w:t>)/,
        `$1${escapeXml(todayFmt)}$2`);

    // 7. Schedule X marks
    xml = fillSchedule(xml, buildScheduleLookup(vd.schedule));

    // ── docxtemplater pass ─────────────────────────────────────
    zip.file('word/document.xml', xml);

    const doc = new Docxtemplater(zip, {
        delimiters: { start: '{{', end: '}}' },
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render({
        nome:       volunteer.name      || '',
        nascimento: fmtDate(vd.birthDate),
        cpf:        volunteer.cpf       || '',
        curso:      vd.course           || '',
        'período':  vd.period           || '',
        ra:         vd.ra               || '',
        rua:        addr.street         || '',
        cidade:     addr.city           || '',
        estado:     addr.state          || '',
        fone:       volunteer.phone     || '',
        email:      volunteer.email     || '',
        atv1: (vd.activities || [])[0]  || '',
        atv2: (vd.activities || [])[1]  || '',
        atv3: (vd.activities || [])[2]  || '',
        atv4: (vd.activities || [])[3]  || '',
        inicio: action.validity?.start  || '',
        fim:    action.validity?.end    || '',
    });

    const output = doc.getZip().generate({
        type: 'nodebuffer',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE',
    });

    const safeName = (volunteer.name || 'Voluntario').replace(/\s+/g, '_');
    return { buffer: output, safeName };
};

// ── Controllers ───────────────────────────────────────────────────

export const gerarTermo = async (req, res) => {
    try {
        const userId = resolveUserId(req);
        const { buffer, safeName } = await buildDocxBuffer(userId);

        res.setHeader('Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition',
            `attachment; filename="Termo-${safeName}.docx"`);
        res.send(buffer);

    } catch (erro) {
        console.error('Erro ao gerar termo (.docx):', erro);
        if (erro.status) return res.status(erro.status).json({ erro: erro.message });
        if (erro.properties?.errors) {
            return res.status(500).json({
                erro: 'Erro ao processar template do termo.',
                detalhes: erro.properties.errors.map(e => e.message),
            });
        }
        res.status(500).json({ erro: 'Erro ao gerar termo.', detalhes: erro.message });
    }
};

export const gerarTermoPdf = async (req, res) => {
    try {
        const userId = resolveUserId(req);
        const { buffer, safeName } = await buildDocxBuffer(userId);

        const pdfBuffer = await libreConvert(buffer, '.pdf', undefined);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition',
            `attachment; filename="Termo-${safeName}.pdf"`);
        res.send(pdfBuffer);

    } catch (erro) {
        console.error('Erro ao gerar termo (.pdf):', erro);
        if (erro.status) return res.status(erro.status).json({ erro: erro.message });
        if (erro.message?.includes('soffice') || erro.message?.includes('LibreOffice')) {
            return res.status(503).json({
                erro: 'Conversão para PDF indisponível. O LibreOffice não está instalado no servidor.',
            });
        }
        res.status(500).json({ erro: 'Erro ao gerar PDF.', detalhes: erro.message });
    }
};
