import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Arvore = {
  id: string;
  nome: string;
  especie: string;
  local: string;
  observacoes: string;
  status: string;
  criadoEm: string;
  demo?: boolean;
};

type MissaoRobo = {
  arvoreId: string;
  robo: string;
  status: string;
  criadoEm: string;
};

type LeituraRobo = {
  temperatura: number;
  umidadeAr: number;
  umidadeSolo: number;
  luminosidade: number;
  inclinacao: number;
  obstaculo: number;
};

const COLORS = {
  bg: '#0E2115',
  surface: '#17321F',
  surface2: '#1D3D27',
  border: '#31583A',

  lime: '#DDEF77',
  green: '#5ED163',
  medium: '#4B844E',

  white: '#F4F5ED',
  muted: '#A9BDAA',
  muted2: '#769078',
};

const obi = require(
  '../../assets/images/obi.png'
);

const logo = require(
  '../../assets/images/tipografiahorizontal.png'
);

const besouro = require(
  '../../assets/images/besourobiobeetliaverde.png'
);

const especies = [
  'Mangueira — Mangifera indica',
  'Ipê-amarelo — Handroanthus albus',
  'Ipê-roxo — Handroanthus impetiginosus',
  'Oitizeiro — Licania tomentosa',
  'Cajueiro — Anacardium occidentale',
  'Pau-brasil — Paubrasilia echinata',
];

const locais = [
  'Entrada principal',
  'Pátio central',
  'Jardim lateral',
  'Bloco A',
  'Bloco B',
  'Área verde norte',
  'Área verde sul',
  'Próximo à biblioteca',
];

function criarDemo(id: string): Arvore | null {
  const numero =
    Number(id.replace('BB-', ''));

  if (
    Number.isNaN(numero) ||
    numero < 1 ||
    numero > 24
  ) {
    return null;
  }

  const index = numero - 1;

  return {
    id,

    nome: `Árvore ${String(
      numero
    ).padStart(2, '0')}`,

    especie:
      especies[index % especies.length],

    local:
      locais[index % locais.length],

    observacoes:
      'Registro demonstrativo utilizado para apresentar a plataforma BioBeetlia.',

    status: 'Monitorada',

    criadoEm:
      new Date().toISOString(),

    demo: true,
  };
}

function leituraDemo(
  id: string
): LeituraRobo {
  const n =
    Number(id.replace('BB-', '')) || 1;

  return {
    temperatura:
      27 + ((n * 3) % 7) * 0.6,

    umidadeAr:
      54 + ((n * 7) % 25),

    umidadeSolo:
      38 + ((n * 11) % 42),

    luminosidade:
      55 + ((n * 9) % 40),

    inclinacao:
      2 + ((n * 4) % 15),

    obstaculo:
      35 + ((n * 13) % 120),
  };
}

export default function ArvoreDetalhes() {
  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [arvore, setArvore] =
    useState<Arvore | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [missao, setMissao] =
    useState<MissaoRobo | null>(null);

  const obiAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    carregar();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(obiAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  async function carregar() {
    if (!id) {
      setCarregando(false);
      return;
    }

    try {
      const dados =
        await AsyncStorage.getItem(
          'arvores'
        );

      const lista: Arvore[] =
        dados
          ? JSON.parse(dados)
          : [];

      let encontrada =
        lista.find(
          (item) => item.id === id
        ) ?? null;

      if (!encontrada) {
        encontrada = criarDemo(id);
      }

      setArvore(encontrada);

      const missaoSalva =
        await AsyncStorage.getItem(
          `missao-robo-${id}`
        );

      if (missaoSalva) {
        setMissao(
          JSON.parse(missaoSalva)
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  async function prepararMissao() {
    if (!arvore) return;

    const novaMissao: MissaoRobo = {
      arvoreId: arvore.id,

      robo:
        'BioBeetlia Quadrúpede V1',

      status:
        'Missão preparada',

      criadoEm:
        new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      `missao-robo-${arvore.id}`,
      JSON.stringify(novaMissao)
    );

    setMissao(novaMissao);

    Alert.alert(
      'Missão preparada',
      `O indivíduo ${arvore.id} foi associado à missão demonstrativa do robô.`
    );
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          color={COLORS.lime}
          size="large"
        />
      </View>
    );
  }

  if (!arvore) {
    return (
      <View style={styles.loading}>
        <Text style={styles.error}>
          Árvore não encontrada.
        </Text>
      </View>
    );
  }

  const dados =
    leituraDemo(arvore.id);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* VOLTAR */}

        <TouchableOpacity
          style={styles.back}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={COLORS.white}
          />

          <Text style={styles.backText}>
            Árvores
          </Text>
        </TouchableOpacity>

        {/* LOGO GRANDE */}

        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* INDIVÍDUO */}

        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>
                {arvore.id}
              </Text>

              <View style={styles.demoMini}>
                <Text style={styles.demoMiniText}>
                  DEMO
                </Text>
              </View>
            </View>

            <Text style={styles.treeName}>
              {arvore.nome}
            </Text>

            <Text style={styles.species}>
              {arvore.especie}
            </Text>

            <View style={styles.location}>
              <Ionicons
                name="location-outline"
                size={14}
                color={COLORS.medium}
              />

              <Text style={styles.locationText}>
                {arvore.local}
              </Text>
            </View>
          </View>

          <Image
            source={besouro}
            style={styles.besouro}
            resizeMode="contain"
          />
        </View>

        {/* INSPEÇÃO */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>
            ÚLTIMA INSPEÇÃO
          </Text>

          <View style={styles.simulationBadge}>
            <View style={styles.greenDot} />

            <Text style={styles.simulationText}>
              SIMULAÇÃO
            </Text>
          </View>
        </View>

        <View style={styles.inspectionCard}>
          <View style={styles.robotHeader}>
            <View style={styles.robotIcon}>
              <Ionicons
                name="hardware-chip-outline"
                size={23}
                color={COLORS.bg}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.robotName}>
                Quadrúpede V1
              </Text>

              <Text style={styles.robotSubtitle}>
                Dados vinculados ao indivíduo {arvore.id}
              </Text>
            </View>
          </View>

          {/* 4 DADOS */}

          <View style={styles.sensorGrid}>
            <Sensor
              icon="thermometer-outline"
              label="Temperatura"
              value={dados.temperatura.toFixed(1)}
              unit="°C"
              percent={dados.temperatura * 2.5}
            />

            <Sensor
              icon="water-outline"
              label="Umidade do ar"
              value={`${dados.umidadeAr}`}
              unit="%"
              percent={dados.umidadeAr}
            />

            <Sensor
              icon="leaf-outline"
              label="Umidade do solo"
              value={`${dados.umidadeSolo}`}
              unit="%"
              percent={dados.umidadeSolo}
            />

            <Sensor
              icon="sunny-outline"
              label="Luminosidade"
              value={`${dados.luminosidade}`}
              unit="%"
              percent={dados.luminosidade}
            />
          </View>

          {/* TELEMETRIA */}

          <Text style={styles.smallTitle}>
            TELEMETRIA
          </Text>

          <View style={styles.telemetryRow}>
            <Telemetry
              icon="speedometer-outline"
              label="Inclinação"
              value={`${dados.inclinacao}°`}
            />

            <Telemetry
              icon="navigate-outline"
              label="Obstáculo"
              value={`${dados.obstaculo} cm`}
            />
          </View>

          {/* FLUXO */}

          <Text style={styles.smallTitle}>
            FLUXO DO DADO
          </Text>

          <View style={styles.flow}>
            <Flow
              icon="pulse"
              label="Sensor"
            />

            <Arrow />

            <Flow
              icon="hardware-chip"
              label="Robô"
            />

            <Arrow />

            <Flow
              icon="phone-portrait"
              label="App"
            />

            <Arrow />

            <Flow
              icon="leaf"
              label={arvore.id}
            />
          </View>
        </View>

        {/* OBI ANIMADO */}

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
                        outputRange: [18, 0],
                      }),
                  },

                  {
                    scale:
                      obiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.88, 1],
                      }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.bubbleTail} />

            <View style={styles.bubble}>
              <Text style={styles.obiLabel}>
                OBI • ASSISTENTE
              </Text>

              <Text style={styles.obiSpeech}>
                Pronto! A inspeção foi associada ao{' '}
                <Text style={styles.obiStrong}>
                  {arvore.id}
                </Text>
                .
              </Text>

              <Text style={styles.obiSub}>
                Assim, cada nova coleta pode formar
                um histórico ambiental deste indivíduo.
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* MISSÃO */}

        <Text style={styles.sectionTitle}>
          MISSÃO ROBÓTICA
        </Text>

        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <Image
              source={besouro}
              style={styles.missionBug}
              resizeMode="contain"
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.missionName}>
                BioBeetlia Quadrúpede V1
              </Text>

              <Text style={styles.missionDescription}>
                Unidade móvel de monitoramento
              </Text>
            </View>
          </View>

          {missao ? (
            <View style={styles.ready}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.lime}
              />

              <View style={{ marginLeft: 8 }}>
                <Text style={styles.readyTitle}>
                  Missão preparada
                </Text>

                <Text style={styles.readyText}>
                  {arvore.id} • {arvore.local}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.missionButton}
              onPress={prepararMissao}
            >
              <Ionicons
                name="navigate"
                size={18}
                color={COLORS.bg}
              />

              <Text style={styles.missionButtonText}>
                Preparar missão
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ZONA VERDE */}

        <TouchableOpacity
          style={styles.zone}
          onPress={() =>
            router.push(
              '/inspecao-zona-verde' as any
            )
          }
        >
          <View style={styles.zoneIcon}>
            <Ionicons
              name="map-outline"
              size={22}
              color={COLORS.bg}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.zoneLabel}>
              ÁREA PILOTO
            </Text>

            <Text style={styles.zoneTitle}>
              Inspeção da Zona Verde
            </Text>

            <Text style={styles.zoneText}>
              Ver protocolo de monitoramento
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.bg}
          />
        </TouchableOpacity>

        <Text style={styles.notice}>
          Valores simulados exclusivamente para
          demonstrar como os dados coletados pelo
          protótipo podem ser apresentados no aplicativo.
        </Text>
      </ScrollView>
    </View>
  );
}

function Sensor({
  icon,
  label,
  value,
  unit,
  percent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  percent: number;
}) {
  const width =
    Math.min(
      Math.max(percent, 8),
      100
    );

  return (
    <View style={styles.sensor}>
      <View style={styles.sensorHeader}>
        <Ionicons
          name={icon}
          size={17}
          color={COLORS.green}
        />

        <Text style={styles.sensorLabel}>
          {label}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {value}
        </Text>

        <Text style={styles.unit}>
          {unit}
        </Text>
      </View>

      <View style={styles.bar}>
        <View
          style={[
            styles.barFill,
            {
              width: `${width}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function Telemetry({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.telemetry}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.lime}
      />

      <Text style={styles.telemetryLabel}>
        {label}
      </Text>

      <Text style={styles.telemetryValue}>
        {value}
      </Text>
    </View>
  );
}

function Flow({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.flowItem}>
      <Ionicons
        name={icon}
        size={15}
        color={COLORS.bg}
      />

      <Text style={styles.flowText}>
        {label}
      </Text>
    </View>
  );
}

function Arrow() {
  return (
    <Ionicons
      name="chevron-forward"
      size={13}
      color={COLORS.medium}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  loading: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    color: COLORS.white,
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  backText: {
    color: COLORS.white,
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    marginLeft: 8,
  },

  logo: {
    width: 285,
    height: 72,
    marginLeft: -8,
    marginBottom: 14,
  },

  hero: {
    backgroundColor: COLORS.lime,

    borderRadius: 26,

    padding: 18,

    flexDirection: 'row',
    alignItems: 'center',
  },

  heroContent: {
    flex: 1,
  },

  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'flex-start',

    backgroundColor: '#C7DC6C',

    borderRadius: 100,

    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  idText: {
    color: COLORS.bg,

    fontFamily: 'Poppins_700Bold',

    fontSize: 9,
  },

  demoMini: {
    marginLeft: 7,

    backgroundColor: COLORS.medium,

    borderRadius: 100,

    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  demoMiniText: {
    color: COLORS.lime,

    fontFamily: 'Poppins_700Bold',

    fontSize: 5,
  },

  treeName: {
    color: COLORS.bg,

    fontFamily: 'Poppins_700Bold',

    fontSize: 25,

    marginTop: 9,
  },

  species: {
    color: COLORS.medium,

    fontFamily: 'Poppins_500Medium',

    fontSize: 9,
  },

  location: {
    marginTop: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    color: COLORS.medium,

    fontFamily: 'Poppins_500Medium',

    fontSize: 9,

    marginLeft: 4,
  },

  besouro: {
    width: 88,
    height: 88,
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 10,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionHeaderTitle: {
    color: COLORS.lime,

    fontFamily: 'Poppins_700Bold',

    fontSize: 10,

    letterSpacing: 1,
  },

  simulationBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.surface2,

    borderRadius: 100,

    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  greenDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: COLORS.green,

    marginRight: 5,
  },

  simulationText: {
    color: COLORS.green,

    fontFamily: 'Poppins_700Bold',

    fontSize: 6,
  },

  inspectionCard: {
    backgroundColor: COLORS.surface,

    borderRadius: 24,

    borderWidth: 1,

    borderColor: COLORS.border,

    padding: 15,
  },

  robotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  robotIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: COLORS.lime,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  robotName: {
    color: COLORS.white,

    fontFamily: 'Poppins_700Bold',

    fontSize: 12,
  },

  robotSubtitle: {
    color: COLORS.muted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,

    marginTop: 2,
  },

  sensorGrid: {
    marginTop: 16,

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',
  },

  sensor: {
    width: '48%',

    backgroundColor: COLORS.surface2,

    borderRadius: 17,

    padding: 13,

    marginBottom: 10,
  },

  sensorHeader: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  sensorLabel: {
    color: COLORS.muted,

    fontFamily: 'Poppins_500Medium',

    fontSize: 7,

    marginLeft: 6,
  },

  valueRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    marginTop: 8,
  },

  value: {
    color: COLORS.white,

    fontFamily: 'Poppins_700Bold',

    fontSize: 23,
  },

  unit: {
    color: COLORS.lime,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 9,

    marginLeft: 3,

    marginBottom: 4,
  },

  bar: {
    height: 5,

    backgroundColor: COLORS.border,

    borderRadius: 100,

    overflow: 'hidden',

    marginTop: 9,
  },

  barFill: {
    height: 5,

    backgroundColor: COLORS.lime,

    borderRadius: 100,
  },

  smallTitle: {
    color: COLORS.muted2,

    fontFamily: 'Poppins_700Bold',

    fontSize: 7,

    letterSpacing: 1,

    marginTop: 10,
    marginBottom: 8,
  },

  telemetryRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  telemetry: {
    width: '48%',

    backgroundColor: COLORS.bg,

    borderRadius: 15,

    padding: 12,
  },

  telemetryLabel: {
    color: COLORS.muted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,

    marginTop: 6,
  },

  telemetryValue: {
    color: COLORS.white,

    fontFamily: 'Poppins_700Bold',

    fontSize: 15,
  },

  flow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  flowItem: {
    minWidth: 50,

    backgroundColor: COLORS.lime,

    borderRadius: 11,

    paddingVertical: 8,
    paddingHorizontal: 7,

    alignItems: 'center',
  },

  flowText: {
    color: COLORS.bg,

    fontFamily: 'Poppins_700Bold',

    fontSize: 6,

    marginTop: 3,
  },

  obiArea: {
    marginTop: 19,

    flexDirection: 'row',

    alignItems: 'flex-end',
  },

  obi: {
    width: 96,
    height: 96,

    marginRight: 8,
  },

  bubbleWrapper: {
    flex: 1,

    position: 'relative',
  },

  bubble: {
    backgroundColor: COLORS.white,

    borderRadius: 19,

    borderBottomLeftRadius: 6,

    padding: 13,
  },

  bubbleTail: {
    position: 'absolute',

    left: -9,
    bottom: 14,

    width: 0,
    height: 0,

    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 11,

    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.white,

    zIndex: 2,
  },

  obiLabel: {
    color: COLORS.medium,

    fontFamily: 'Poppins_700Bold',

    fontSize: 6.5,

    letterSpacing: 0.7,
  },

  obiSpeech: {
    color: COLORS.bg,

    fontFamily: 'Poppins_500Medium',

    fontSize: 9,

    lineHeight: 14,

    marginTop: 4,
  },

  obiStrong: {
    color: '#178A4A',

    fontFamily: 'Poppins_700Bold',
  },

  obiSub: {
    color: COLORS.medium,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,

    lineHeight: 11,

    marginTop: 5,
  },

  sectionTitle: {
    color: COLORS.lime,

    fontFamily: 'Poppins_700Bold',

    fontSize: 10,

    letterSpacing: 1,

    marginTop: 27,
    marginBottom: 10,
  },

  missionCard: {
    backgroundColor: COLORS.surface,

    borderRadius: 22,

    borderWidth: 1,

    borderColor: COLORS.border,

    padding: 15,
  },

  missionHeader: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  missionBug: {
    width: 47,
    height: 47,

    marginRight: 10,
  },

  missionName: {
    color: COLORS.white,

    fontFamily: 'Poppins_700Bold',

    fontSize: 11,
  },

  missionDescription: {
    color: COLORS.muted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,
  },

  missionButton: {
    marginTop: 14,

    height: 48,

    borderRadius: 16,

    backgroundColor: COLORS.lime,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  missionButtonText: {
    color: COLORS.bg,

    fontFamily: 'Poppins_700Bold',

    fontSize: 10,

    marginLeft: 7,
  },

  ready: {
    marginTop: 14,

    backgroundColor: COLORS.surface2,

    borderRadius: 15,

    padding: 12,

    flexDirection: 'row',

    alignItems: 'center',
  },

  readyTitle: {
    color: COLORS.lime,

    fontFamily: 'Poppins_700Bold',

    fontSize: 9,
  },

  readyText: {
    color: COLORS.muted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,
  },

  zone: {
    marginTop: 20,

    backgroundColor: COLORS.lime,

    borderRadius: 20,

    padding: 14,

    flexDirection: 'row',

    alignItems: 'center',
  },

  zoneIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: '#C7DC6C',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  zoneLabel: {
    color: COLORS.medium,

    fontFamily: 'Poppins_700Bold',

    fontSize: 6,

    letterSpacing: 0.8,
  },

  zoneTitle: {
    color: COLORS.bg,

    fontFamily: 'Poppins_700Bold',

    fontSize: 11,
  },

  zoneText: {
    color: COLORS.medium,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,
  },

  notice: {
    color: COLORS.muted2,

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,

    lineHeight: 11,

    textAlign: 'center',

    marginTop: 18,

    paddingHorizontal: 20,
  },
});