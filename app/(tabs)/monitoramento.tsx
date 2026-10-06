import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const COLORS = {
  luzRegenerativa: '#DDEF77',
  brotoInteligente: '#5ED163',
  copaCientifica: '#4B844E',
  nevoaBotanica: '#F4F5ED',
  mataProfunda: '#1B371E',

  card: '#244629',
  cardDark: '#203E24',
  textMuted: '#B7C9B7',

  warning: '#EBCB67',
  danger: '#E97878',
};

const TEMPERATURE_HISTORY = [29, 30, 31, 30, 32, 31, 31];
const MOISTURE_HISTORY = [47, 44, 42, 40, 39, 41, 42];

export default function MonitoringScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              BIOBEETLIA
            </Text>

            <Text style={styles.title}>
              Monitoramento
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              SISTEMA ATIVO
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Visão integrada das condições ambientais registradas pelo sistema.
        </Text>

        {/* SISTEMA */}

        <View style={styles.systemCard}>
          <View style={styles.systemTop}>
            <View style={styles.robotIcon}>
              <Ionicons
                name="hardware-chip-outline"
                size={25}
                color={COLORS.mataProfunda}
              />
            </View>

            <View style={styles.systemInfo}>
              <Text style={styles.systemTitle}>
                Unidade de monitoramento
              </Text>

              <Text style={styles.systemSubtitle}>
                BioBeetlia • Protótipo 01
              </Text>
            </View>

            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>
                ONLINE
              </Text>
            </View>
          </View>

          <View style={styles.systemDivider} />

          <View style={styles.systemStats}>
            <SmallStat
              icon="battery-half-outline"
              label="Bateria"
              value="78%"
            />

            <SmallStat
              icon="wifi-outline"
              label="Conexão"
              value="Estável"
            />

            <SmallStat
              icon="time-outline"
              label="Atualização"
              value="Agora"
            />
          </View>
        </View>

        {/* LEITURAS */}

        <Text style={styles.sectionTitle}>
          LEITURAS AMBIENTAIS
        </Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="thermometer-outline"
            value="31°C"
            label="Temperatura"
            trend="+1,2°C"
            trendType="warning"
          />

          <MetricCard
            icon="water-outline"
            value="58%"
            label="Umidade do ar"
            trend="Estável"
            trendType="good"
          />

          <MetricCard
            icon="leaf-outline"
            value="42%"
            label="Umidade do solo"
            trend="-3%"
            trendType="warning"
          />

          <MetricCard
            icon="sunny-outline"
            value="76%"
            label="Luminosidade"
            trend="Normal"
            trendType="good"
          />
        </View>

        {/* GRÁFICO TEMPERATURA */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleNoMargin}>
            TEMPERATURA
          </Text>

          <Text style={styles.period}>
            7 leituras
          </Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartValue}>
                31°C
              </Text>

              <Text style={styles.chartSubtitle}>
                média recente
              </Text>
            </View>

            <View style={styles.chartStatus}>
              <Ionicons
                name="trending-up-outline"
                size={14}
                color={COLORS.warning}
              />

              <Text style={styles.chartStatusText}>
                leve aumento
              </Text>
            </View>
          </View>

          <View style={styles.chart}>
            {TEMPERATURE_HISTORY.map((value, index) => (
              <View
                key={`temp-${index}`}
                style={styles.barColumn}
              >
                <View
                  style={[
                    styles.tempBar,
                    {
                      height: Math.max(
                        (value - 25) * 9,
                        18
                      ),
                    },
                  ]}
                />

                <Text style={styles.barLabel}>
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* GRÁFICO SOLO */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleNoMargin}>
            UMIDADE DO SOLO
          </Text>

          <Text style={styles.period}>
            7 leituras
          </Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartValue}>
                42%
              </Text>

              <Text style={styles.chartSubtitle}>
                leitura média
              </Text>
            </View>

            <View style={styles.chartStatus}>
              <Ionicons
                name="trending-down-outline"
                size={14}
                color={COLORS.warning}
              />

              <Text style={styles.chartStatusText}>
                leve queda
              </Text>
            </View>
          </View>

          <View style={styles.chart}>
            {MOISTURE_HISTORY.map((value, index) => (
              <View
                key={`moist-${index}`}
                style={styles.barColumn}
              >
                <View
                  style={[
                    styles.moistureBar,
                    {
                      height: Math.max(
                        value * 1.35,
                        18
                      ),
                    },
                  ]}
                />

                <Text style={styles.barLabel}>
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ALERTAS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleNoMargin}>
            ALERTAS
          </Text>

          <View style={styles.alertCount}>
            <Text style={styles.alertCountText}>
              2
            </Text>
          </View>
        </View>

        <AlertCard
          type="warning"
          tree="BB-002"
          title="Umidade abaixo da tendência"
          description="A umidade do solo apresentou redução nas últimas leituras."
          time="Hoje, 08:31"
        />

        <AlertCard
          type="danger"
          tree="BB-004"
          title="Inspeção recomendada"
          description="Baixa umidade do solo detectada. Recomenda-se avaliação presencial."
          time="Ontem, 15:55"
        />

        {/* RESUMO */}

        <Text style={styles.sectionTitle}>
          RESUMO DO SISTEMA
        </Text>

        <View style={styles.summaryCard}>
          <SummaryRow
            icon="leaf-outline"
            label="Árvores monitoradas"
            value="24"
          />

          <SummaryDivider />

          <SummaryRow
            icon="checkmark-circle-outline"
            label="Registros completos"
            value="92%"
          />

          <SummaryDivider />

          <SummaryRow
            icon="navigate-outline"
            label="Percursos concluídos"
            value="90%"
          />
        </View>

        {/* AÇÃO */}

        <TouchableOpacity
          style={styles.refreshButton}
          activeOpacity={0.85}
        >
          <Ionicons
            name="refresh-outline"
            size={19}
            color={COLORS.mataProfunda}
          />

          <Text style={styles.refreshText}>
            Atualizar leituras
          </Text>
        </TouchableOpacity>

        <Text style={styles.demoNotice}>
          Dados demonstrativos para desenvolvimento do protótipo.
        </Text>
      </ScrollView>
    </View>
  );
}

function MetricCard({
  icon,
  value,
  label,
  trend,
  trendType,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  trend: string;
  trendType: 'good' | 'warning';
}) {
  const trendColor =
    trendType === 'good'
      ? COLORS.brotoInteligente
      : COLORS.warning;

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricTop}>
        <View style={styles.metricIcon}>
          <Ionicons
            name={icon}
            size={18}
            color={COLORS.luzRegenerativa}
          />
        </View>

        <Text
          style={[
            styles.metricTrend,
            {
              color: trendColor,
            },
          ]}
        >
          {trend}
        </Text>
      </View>

      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.smallStat}>
      <Ionicons
        name={icon}
        size={17}
        color={COLORS.luzRegenerativa}
      />

      <Text style={styles.smallStatValue}>
        {value}
      </Text>

      <Text style={styles.smallStatLabel}>
        {label}
      </Text>
    </View>
  );
}

function AlertCard({
  type,
  tree,
  title,
  description,
  time,
}: {
  type: 'warning' | 'danger';
  tree: string;
  title: string;
  description: string;
  time: string;
}) {
  const color =
    type === 'warning'
      ? COLORS.warning
      : COLORS.danger;

  return (
    <View
      style={[
        styles.alertCard,
        {
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.alertIcon,
          {
            backgroundColor: `${color}20`,
          },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={23}
          color={color}
        />
      </View>

      <View style={styles.alertContent}>
        <Text style={styles.alertTree}>
          {tree}
        </Text>

        <Text style={styles.alertTitle}>
          {title}
        </Text>

        <Text style={styles.alertDescription}>
          {description}
        </Text>

        <Text style={styles.alertTime}>
          {time}
        </Text>
      </View>
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={COLORS.luzRegenerativa}
        />
      </View>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>

      <Text style={styles.summaryValue}>
        {value}
      </Text>
    </View>
  );
}

function SummaryDivider() {
  return (
    <View style={styles.summaryDivider} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mataProfunda,
  },

  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  eyebrow: {
    color: COLORS.luzRegenerativa,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    letterSpacing: 2,
  },

  title: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_700Bold',
    fontSize: 29,
    marginTop: -2,
  },

  subtitle: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 340,
  },

  liveBadge: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.copaCientifica,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.brotoInteligente,
    marginRight: 6,
  },

  liveText: {
    color: COLORS.brotoInteligente,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 0.5,
  },

  systemCard: {
    marginTop: 25,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.copaCientifica,
    borderRadius: 22,
    padding: 16,
  },

  systemTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  robotIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.luzRegenerativa,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  systemInfo: {
    flex: 1,
  },

  systemTitle: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  systemSubtitle: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 2,
  },

  onlineBadge: {
    backgroundColor: '#315B35',
    borderRadius: 30,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  onlineText: {
    color: COLORS.brotoInteligente,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
  },

  systemDivider: {
    height: 1,
    backgroundColor: COLORS.copaCientifica,
    opacity: 0.45,
    marginVertical: 15,
  },

  systemStats: {
    flexDirection: 'row',
  },

  smallStat: {
    flex: 1,
    alignItems: 'center',
  },

  smallStatValue: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    marginTop: 5,
  },

  smallStatLabel: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 1,
  },

  sectionTitle: {
    color: COLORS.luzRegenerativa,
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: 12,
  },

  sectionTitleNoMargin: {
    color: COLORS.luzRegenerativa,
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    letterSpacing: 1,
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  period: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  metricCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.copaCientifica,
    padding: 15,
    marginBottom: 12,
  },

  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.copaCientifica,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metricTrend: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 8,
  },

  metricValue: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    marginTop: 12,
  },

  metricLabel: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 1,
  },

  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.copaCientifica,
    padding: 17,
  },

  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  chartValue: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_700Bold',
    fontSize: 23,
  },

  chartSubtitle: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
  },

  chartStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 30,
  },

  chartStatusText: {
    color: COLORS.warning,
    fontFamily: 'Poppins_500Medium',
    fontSize: 7,
    marginLeft: 4,
  },

  chart: {
    height: 105,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  tempBar: {
    width: 18,
    borderRadius: 7,
    backgroundColor: COLORS.warning,
    maxHeight: 85,
  },

  moistureBar: {
    width: 18,
    borderRadius: 7,
    backgroundColor: COLORS.luzRegenerativa,
    maxHeight: 85,
  },

  barLabel: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 5,
  },

  alertCount: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertCountText: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_700Bold',
    fontSize: 9,
  },

  alertCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 11,
  },

  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  alertContent: {
    flex: 1,
  },

  alertTree: {
    color: COLORS.luzRegenerativa,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
    letterSpacing: 0.8,
  },

  alertTitle: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    marginTop: 1,
  },

  alertDescription: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  alertTime: {
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.copaCientifica,
    paddingHorizontal: 15,
  },

  summaryRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  summaryLabel: {
    flex: 1,
    color: COLORS.textMuted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
  },

  summaryValue: {
    color: COLORS.nevoaBotanica,
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.copaCientifica,
    opacity: 0.35,
  },

  refreshButton: {
    marginTop: 28,
    backgroundColor: COLORS.luzRegenerativa,
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  refreshText: {
    color: COLORS.mataProfunda,
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    marginLeft: 8,
  },

  demoNotice: {
    color: '#718B73',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 14,
  },
});