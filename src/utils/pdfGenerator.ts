import jsPDF from 'jspdf';
import { DrugData } from '@/data/drugDatabase';

export function generatePDF(drugData: DrugData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Helper function for text wrapping
  const addWrappedText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * (fontSize * 0.5) + 5;
  };

  // Header
  doc.setFillColor(0, 94, 184); // #005EB8
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PharmAgent Strategy Report', margin, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, 35);

  // Reset text color
  doc.setTextColor(30, 41, 59); // Slate 800
  yPos = 55;

  // Drug Name Header
  doc.setFillColor(240, 249, 255);
  doc.rect(margin, yPos - 5, contentWidth, 20, 'F');
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Drug Analysis: ${drugData.name}`, margin + 5, yPos + 8);
  yPos += 25;

  // Indication
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Target Indication:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.indication, margin + 45, yPos);
  yPos += 15;

  // Patent Information Section
  doc.setFillColor(0, 94, 184);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PATENT ANALYSIS', margin + 5, yPos + 6);
  yPos += 15;
  doc.setTextColor(30, 41, 59);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Patent ID:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.patent.id, margin + 30, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Expiry:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.patent.expiry, margin + 30, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('FTO Status:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.patent.fto, margin + 30, yPos);
  yPos += 12;

  // Clinical Trials Section
  doc.setFillColor(0, 94, 184);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINICAL TRIALS', margin + 5, yPos + 6);
  yPos += 15;
  doc.setTextColor(30, 41, 59);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Active Trials:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${drugData.trials.count} (${drugData.trials.phase})`, margin + 35, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('NCT ID:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.trials.nctId, margin + 35, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Indication:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.trials.indication, margin + 35, yPos);
  yPos += 12;

  // Market Analysis Section
  doc.setFillColor(0, 94, 184);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MARKET ANALYSIS', margin + 5, yPos + 6);
  yPos += 15;
  doc.setTextColor(30, 41, 59);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Market Size:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.market.size, margin + 35, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Competition:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.market.competition, margin + 35, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('CAGR:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.market.cagr, margin + 35, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Key Players:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(drugData.market.keyPlayers.join(', '), margin + 35, yPos);
  yPos += 15;

  // Strategic Summary
  doc.setFillColor(0, 94, 184);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('STRATEGIC RECOMMENDATION', margin + 5, yPos + 6);
  yPos += 15;
  doc.setTextColor(30, 41, 59);

  // Clean synthesis text (remove markdown)
  const cleanSynthesis = drugData.synthesis
    .replace(/\*\*/g, '')
    .replace(/^- /gm, '• ')
    .replace(/^#+ /gm, '');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const synthLines = doc.splitTextToSize(cleanSynthesis, contentWidth);
  doc.text(synthLines, margin, yPos);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(240, 249, 255);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PharmAgent AI R&D Co-pilot | Confidential Strategy Document', margin, pageHeight - 10);
  doc.text(`Page 1 of 1`, pageWidth - margin - 20, pageHeight - 10);

  // Save the PDF
  doc.save(`PharmAgent_${drugData.name}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
