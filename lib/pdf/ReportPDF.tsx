import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';

export interface ReportPDFData {
  patient: {
    firstName: string;
    lastName: string;
    fiscalCode: string;
    birthDate: Date | null;
    birthPlace: string | null;
    gender: 'M' | 'F' | 'ALTRO' | null;
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialization: string | null;
    licenseNumber: string | null;
    clinicName: string | null;
    clinicAddress: string | null;
    phone: string | null;
  };
  visit: {
    acceptanceDate: Date | null;
    examDate: Date | null;
  };
  report: {
    final: string;
    approvedAt: Date | null;
  };
}

const GENDER_LABEL: Record<string, string> = {
  M: 'Maschio',
  F: 'Femmina',
  ALTRO: 'Altro',
};

function fmtDate(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function fmtDateTime(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 48,
    flexDirection: 'column',
  },
  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  clinicName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  clinicAddress: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  doctorLine: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginBottom: 16,
  },
  // ── Title ─────────────────────────────────────────────────────────────────
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111827',
  },
  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    width: 130,
  },
  value: {
    fontSize: 9,
    color: '#111827',
    flex: 1,
    fontFamily: 'Helvetica-Bold',
  },
  // ── Report body ───────────────────────────────────────────────────────────
  reportSection: {
    marginBottom: 24,
    flex: 1,
  },
  reportText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    fontSize: 9,
    color: '#374151',
  },
  footerRight: {
    alignItems: 'center',
    width: 180,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    width: 160,
    marginBottom: 4,
    height: 32,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  doctorName: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
});

function ReportPDF({ patient, doctor, visit, report }: ReportPDFData) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.clinicName}>
              {doctor.clinicName ?? `Studio Dr. ${doctor.lastName}`}
            </Text>
            {doctor.clinicAddress && (
              <Text style={s.clinicAddress}>{doctor.clinicAddress}</Text>
            )}
            {doctor.phone && (
              <Text style={s.clinicAddress}>Tel. {doctor.phone}</Text>
            )}
          </View>
          <View style={s.headerRight}>
            {doctor.specialization && (
              <Text style={s.doctorLine}>{doctor.specialization}</Text>
            )}
            {doctor.licenseNumber && (
              <Text style={s.doctorLine}>
                Iscrizione Albo N° {doctor.licenseNumber}
              </Text>
            )}
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Title ── */}
        <Text style={s.title}>REFERTO MEDICO</Text>

        {/* ── Dati paziente ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>DATI DEL PAZIENTE</Text>
          <View style={s.row}>
            <Text style={s.label}>Nome e Cognome</Text>
            <Text style={s.value}>
              {patient.firstName} {patient.lastName}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Sesso</Text>
            <Text style={s.value}>
              {patient.gender ? GENDER_LABEL[patient.gender] : '—'}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Data di nascita</Text>
            <Text style={s.value}>{fmtDate(patient.birthDate)}</Text>
          </View>
          {patient.birthPlace && (
            <View style={s.row}>
              <Text style={s.label}>Luogo di nascita</Text>
              <Text style={s.value}>{patient.birthPlace}</Text>
            </View>
          )}
          <View style={s.row}>
            <Text style={s.label}>Codice Fiscale</Text>
            <Text style={s.value}>{patient.fiscalCode}</Text>
          </View>
        </View>

        {/* ── Dati esame ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>DATI DELL&apos;ESAME</Text>
          <View style={s.row}>
            <Text style={s.label}>Data accettazione</Text>
            <Text style={s.value}>{fmtDate(visit.acceptanceDate)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Data e ora esecuzione</Text>
            <Text style={s.value}>{fmtDateTime(visit.examDate)}</Text>
          </View>
        </View>

        {/* ── Referto ── */}
        <View style={s.reportSection}>
          <Text style={s.sectionTitle}>REFERTO</Text>
          <Text style={s.reportText}>{report.final}</Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerLeft}>
              Data: {fmtDate(report.approvedAt ?? new Date())}
            </Text>
          </View>
          <View style={s.footerRight}>
            <View style={s.signatureLine} />
            <Text style={s.doctorName}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
            <Text style={s.signatureLabel}>Firma del medico</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateReportPDF(data: ReportPDFData): Promise<Buffer> {
  return renderToBuffer(<ReportPDF {...data} />) as Promise<Buffer>;
}
