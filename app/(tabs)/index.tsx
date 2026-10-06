import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  bg: '#0E2115',

  card: '#17321F',
  card2: '#1D3D27',
  card3: '#24462C',

  border: '#31583A',

  lime: '#DDEF77',
  limeDark: '#CADB6A',

  green: '#5ED163',
  medium: '#4B844E',

  white: '#F4F5ED',
  muted: '#A9BDAA',
  muted2: '#789079',

  dark: '#102114',
};

const logo = require(
  '../../assets/images/tipografiahorizontal.png'
);

const obi = require(
  '../../assets/images/obi.png'
);

export default function HomeScreen() {
  const obiAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(obiAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }, 350);

    return () => clearTimeout(timer);
  }, [obiAnim]);

  return (
    <View style={styles.screen}>
      <Tabs.Screen
        options={{
          headerShown: false,
          title: 'Início',
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* LOGO */}

        <View style={styles.logoCrop}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        {/* HERO */}

        <Text style={styles.eyebrow}>
          INTELIGÊNCIA AMBIENTAL
        </Text>

        <Text style={styles.heroTitle}>
          Monitorar para prever.
        </Text>

        <Text style={styles.heroGreen}>
          Prever para preservar.
        </Text>

        <Text style={styles.description}>
          Robótica e dados aplicados ao monitoramento
          inteligente da arborização.
        </Text>

        {/* OBI */}

        <View style={styles.obiArea}>
          <Image
            source={obi}
            style={styles.obi}
            resizeMode="contain"
          />

          <Animated.View
            style={[
              styles.bubbleWrapper,
              {
                opacity: obiAnim,

                transform: [
                  {
                    translateY:
                      obiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 0],
                      }),
                  },

                  {
                    scale:
                      obiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.tail} />

            <View style={styles.bubble}>
              <Text style={styles.obiLabel}>
                OBI
              </Text>

              <Text style={styles.obiText}>
                24 árvores estão prontas.
              </Text>

              <Text style={styles.obiSub}>
                Quer abrir a última inspeção?
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ÁRVORES */}

        <TouchableOpacity
          style={styles.mainCard}
          activeOpacity={0.88}
          onPress={() =>
            router.push('/arvores' as any)
          }
        >
          <View style={styles.mainIcon}>
            <Ionicons
              name="leaf"
              size={23}
              color={COLORS.dark}
            />
          </View>

          <View style={styles.mainContent}>
            <View style={styles.numberRow}>
              <Text style={styles.number}>
                24
              </Text>

              <Text style={styles.numberLabel}>
                ÁRVORES
              </Text>
            </View>

            <Text style={styles.mainTitle}>
              Indivíduos monitorados
            </Text>

            <Text style={styles.mainSubtitle}>
              Abrir base demonstrativa
            </Text>
          </View>

          <View style={styles.mainArrow}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={COLORS.dark}
            />
          </View>
        </TouchableOpacity>

        {/* ÚLTIMA INSPEÇÃO */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ÚLTIMA INSPEÇÃO
          </Text>

          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>
              DEMO
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.inspectionCard}
          activeOpacity={0.88}
          onPress={() =>
            router.push(
              '/arvore/BB-012' as any
            )
          }
        >
          <View style={styles.inspectionTop}>
            <View style={styles.inspectionTreeIcon}>
              <Ionicons
                name="leaf-outline"
                size={21}
                color={COLORS.lime}
              />
            </View>

            <View style={styles.inspectionTitleArea}>
              <Text style={styles.inspectionId}>
                BB-012
              </Text>

              <Text style={styles.inspectionName}>
                Árvore 12
              </Text>

              <Text style={styles.inspectionLocation}>
                Bloco B
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.lime}
            />
          </View>

          <View style={styles.metricRow}>
            <MiniMetric
              icon="thermometer-outline"
              value="29,4°"
              label="Temperatura"
            />

            <MiniMetric
              icon="water-outline"
              value="63%"
              label="Umidade"
            />

            <MiniMetric
              icon="leaf-outline"
              value="44%"
              label="Solo"
            />
          </View>

          <View style={styles.inspectionFooter}>
            <View style={styles.robotMini}>
              <Ionicons
                name="hardware-chip-outline"
                size={15}
                color={COLORS.green}
              />

              <Text style={styles.robotMiniText}>
                Quadrúpede V1
              </Text>
            </View>

            <Text style={styles.inspectionAction}>
              VER DETALHES
            </Text>
          </View>
        </TouchableOpacity>

        {/* SISTEMA */}

        <Text style={styles.sectionTitleStandalone}>
          SISTEMA
        </Text>

        <View style={styles.systemStrip}>
          <View style={styles.systemAccent} />

          <View style={styles.systemIcon}>
            <Ionicons
              name="hardware-chip-outline"
              size={22}
              color={COLORS.lime}
            />
          </View>

          <View style={styles.systemContent}>
            <View style={styles.systemTop}>
              <Text style={styles.systemEyebrow}>
                QUADRÚPEDE V1
              </Text>

              <View style={styles.systemStatus}>
                <View style={styles.systemDot} />

                <Text style={styles.systemStatusText}>
                  DEMO
                </Text>
              </View>
            </View>

            <Text style={styles.systemTitle}>
              Ecossistema de monitoramento
            </Text>

            <Text style={styles.systemFlow}>
              sensor → robô → aplicativo → árvore
            </Text>
          </View>
        </View>

        {/* ZONA VERDE */}

        <Text style={styles.sectionTitleStandalone}>
          ÁREA PILOTO
        </Text>

        <TouchableOpacity
          style={styles.zoneCard}
          activeOpacity={0.88}
          onPress={() =>
            router.push(
              '/inspecao-zona-verde' as any
            )
          }
        >
          <View style={styles.zoneDecor1} />
          <View style={styles.zoneDecor2} />

          <View style={styles.zoneTop}>
            <View style={styles.zoneIcon}>
              <Ionicons
                name="map-outline"
                size={25}
                color={COLORS.dark}
              />
            </View>

            <Text style={styles.zoneNumber}>
              01
            </Text>
          </View>

          <Text style={styles.zoneEyebrow}>
            INSPEÇÃO AMBIENTAL
          </Text>

          <Text style={styles.zoneTitle}>
            Zona Verde
          </Text>

          <Text style={styles.zoneText}>
            Acompanhe o protocolo que conecta árvores,
            sensores, deslocamento do robô e registros
            ambientais.
          </Text>

          <View style={styles.zoneBottom}>
            <Text style={styles.zoneAction}>
              ABRIR INSPEÇÃO
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={COLORS.dark}
            />
          </View>
        </TouchableOpacity>

        {/* NOVA ÁRVORE */}

        <TouchableOpacity
          style={styles.newTree}
          activeOpacity={0.85}
          onPress={() =>
            router.push('/cadastrar' as any)
          }
        >
          <View style={styles.newTreeIcon}>
            <Ionicons
              name="add"
              size={22}
              color={COLORS.lime}
            />
          </View>

          <View style={styles.newTreeContent}>
            <Text style={styles.newTreeEyebrow}>
              NOVO INDIVÍDUO
            </Text>

            <Text style={styles.newTreeTitle}>
              Cadastrar árvore
            </Text>

            <Text style={styles.newTreeText}>
              Criar novo registro
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.green}
          />
        </TouchableOpacity>

        {/* ATIVIDADE */}

        <View style={styles.activityHeader}>
          <View>
            <Text style={styles.sectionTitleNoMargin}>
              ATIVIDADE
            </Text>

            <Text style={styles.activitySubtitle}>
              Fluxo demonstrativo recente
            </Text>
          </View>

          <View style={styles.activityCount}>
            <Text style={styles.activityCountText}>
              03
            </Text>
          </View>
        </View>

        <View style={styles.timeline}>
          <TimelineItem
            icon="pulse-outline"
            title="Leitura associada"
            subtitle="BB-012 • Quadrúpede V1"
            last={false}
          />

          <TimelineItem
            icon="navigate-outline"
            title="Missão preparada"
            subtitle="BB-007 • Zona Verde"
            last={false}
          />

          <TimelineItem
            icon="map-outline"
            title="Protocolo disponível"
            subtitle="Inspeção da Zona Verde"
            last={true}
          />
        </View>

        {/* AVISO */}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color={COLORS.lime}
          />

          <Text style={styles.noticeText}>
            Os dados apresentados nesta tela são
            demonstrativos e representam o fluxo
            previsto da plataforma.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.miniMetric}>
      <Ionicons
        name={icon}
        size={15}
        color={COLORS.green}
      />

      <Text style={styles.miniMetricValue}>
        {value}
      </Text>

      <Text style={styles.miniMetricLabel}>
        {label}
      </Text>
    </View>
  );
}

function TimelineItem({
  icon,
  title,
  subtitle,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  last: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={styles.timelineDot}>
          <Ionicons
            name={icon}
            size={15}
            color={COLORS.dark}
          />
        </View>

        {!last && (
          <View style={styles.timelineLine} />
        )}
      </View>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>
          {title}
        </Text>

        <Text style={styles.timelineSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="checkmark"
        size={16}
        color={COLORS.green}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingTop: 56,
    paddingHorizontal: 21,
    paddingBottom: 120,
  },

  logoCrop: {
    width: 250,
    height: 54,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 29,
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  eyebrow: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 8,
    letterSpacing: 1.8,
  },

  heroTitle: {
    color: COLORS.white,
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    lineHeight: 34,
    marginTop: 8,
  },

  heroGreen: {
    color: COLORS.green,
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    lineHeight: 34,
  },

  description: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 9,
    maxWidth: 300,
  },

  obiArea: {
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 82,
  },

  obi: {
    width: 78,
    height: 78,
    marginRight: 9,
    marginLeft: -2,
    transform: [{ translateY: 5 }],
  },

  bubbleWrapper: {
    flex: 1,
    position: 'relative',
  },

  bubble: {
    minHeight: 72,
    backgroundColor: COLORS.white,
    borderRadius: 19,
    borderBottomLeftRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 11,
    justifyContent: 'center',
  },

  tail: {
    position: 'absolute',
    left: -9,
    top: 28,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.white,
    zIndex: 3,
  },

  obiLabel: {
    color: COLORS.medium,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6.5,
    letterSpacing: 1,
  },

  obiText: {
    color: COLORS.dark,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 2,
  },

  obiSub: {
    color: COLORS.medium,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7.5,
    marginTop: 3,
  },

  mainCard: {
    marginTop: 18,
    backgroundColor: COLORS.lime,
    borderRadius: 22,
    padding: 15,
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'center',
  },

  mainIcon: {
    width: 53,
    height: 53,
    borderRadius: 16,
    backgroundColor: COLORS.limeDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  mainContent: {
    flex: 1,
  },

  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  number: {
    color: COLORS.dark,
    fontFamily: 'Poppins_700Bold',
    fontSize: 31,
    lineHeight: 34,
  },

  numberLabel: {
    color: COLORS.medium,
    fontFamily: 'Poppins_700Bold',
    fontSize: 7,
    letterSpacing: 1,
    marginLeft: 7,
  },

  mainTitle: {
    color: COLORS.dark,
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginTop: 1,
  },

  mainSubtitle: {
    color: COLORS.medium,
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 2,
  },

  mainArrow: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: COLORS.limeDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 8,
    letterSpacing: 1.3,
  },

  sectionTitleStandalone: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 8,
    letterSpacing: 1.3,
    marginTop: 27,
    marginBottom: 10,
  },

  sectionTitleNoMargin: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 8,
    letterSpacing: 1.3,
  },

  demoBadge: {
    backgroundColor: COLORS.card2,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  demoBadgeText: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6,
    letterSpacing: 0.7,
  },

  inspectionCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    padding: 14,
  },

  inspectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inspectionTreeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.card2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  inspectionTitleArea: {
    flex: 1,
  },

  inspectionId: {
    color: COLORS.green,
    fontFamily: 'Poppins_700Bold',
    fontSize: 7,
    letterSpacing: 0.8,
  },

  inspectionName: {
    color: COLORS.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  inspectionLocation: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 1,
  },

  metricRow: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  miniMetric: {
    width: '31.5%',
    backgroundColor: COLORS.card2,
    borderRadius: 14,
    padding: 10,
  },

  miniMetricValue: {
    color: COLORS.white,
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginTop: 5,
  },

  miniMetricLabel: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 6.5,
    marginTop: 1,
  },

  inspectionFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  robotMini: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  robotMiniText: {
    color: COLORS.muted,
    fontFamily: 'Poppins_500Medium',
    fontSize: 7,
    marginLeft: 5,
  },

  inspectionAction: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6.5,
    letterSpacing: 0.8,
  },

  systemStrip: {
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132A1A',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingRight: 15,
  },

  systemAccent: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: COLORS.green,
    marginRight: 13,
  },

  systemIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.card2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  systemContent: {
    flex: 1,
  },

  systemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  systemEyebrow: {
    color: COLORS.green,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6,
    letterSpacing: 0.8,
  },

  systemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  systemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
    marginRight: 5,
  },

  systemStatusText: {
    color: COLORS.green,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6,
  },

  systemTitle: {
    color: COLORS.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10.5,
    marginTop: 4,
  },

  systemFlow: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7.5,
    marginTop: 4,
  },

  zoneCard: {
    minHeight: 225,
    backgroundColor: COLORS.lime,
    borderRadius: 25,
    padding: 18,
    overflow: 'hidden',
  },

  zoneDecor1: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#C9DC69',
    right: -75,
    top: -65,
  },

  zoneDecor2: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 48,
    borderWidth: 17,
    borderColor: '#D4E676',
    right: 30,
    bottom: -40,
  },

  zoneTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  zoneIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: '#C5D769',
    alignItems: 'center',
    justifyContent: 'center',
  },

  zoneNumber: {
    color: COLORS.medium,
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
  },

  zoneEyebrow: {
    color: COLORS.medium,
    fontFamily: 'Poppins_700Bold',
    fontSize: 7,
    letterSpacing: 1.2,
    marginTop: 25,
  },

  zoneTitle: {
    color: COLORS.dark,
    fontFamily: 'Poppins_700Bold',
    fontSize: 25,
    marginTop: 2,
  },

  zoneText: {
    maxWidth: 255,
    color: COLORS.medium,
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 15,
    marginTop: 7,
  },

  zoneBottom: {
    marginTop: 20,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#C2D466',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  zoneAction: {
    color: COLORS.medium,
    fontFamily: 'Poppins_700Bold',
    fontSize: 7,
    letterSpacing: 1.1,
  },

  newTree: {
    marginTop: 11,
    minHeight: 70,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  newTreeIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.card2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  newTreeContent: {
    flex: 1,
  },

  newTreeEyebrow: {
    color: COLORS.green,
    fontFamily: 'Poppins_700Bold',
    fontSize: 6,
    letterSpacing: 0.8,
  },

  newTreeTitle: {
    color: COLORS.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    marginTop: 1,
  },

  newTreeText: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 1,
  },

  activityHeader: {
    marginTop: 28,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activitySubtitle: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 3,
  },

  activityCount: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityCountText: {
    color: COLORS.lime,
    fontFamily: 'Poppins_700Bold',
    fontSize: 8,
  },

  timeline: {
    backgroundColor: '#132A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 5,
  },

  timelineItem: {
    minHeight: 63,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  timelineLeft: {
    width: 37,
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  timelineDot: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: 3,
  },

  timelineContent: {
    flex: 1,
    paddingLeft: 9,
    paddingTop: 1,
  },

  timelineTitle: {
    color: COLORS.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
  },

  timelineSubtitle: {
    color: COLORS.muted,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    marginTop: 2,
  },

  notice: {
    marginTop: 17,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  noticeText: {
    flex: 1,
    color: COLORS.muted2,
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
    lineHeight: 11,
    marginLeft: 7,
  },
});