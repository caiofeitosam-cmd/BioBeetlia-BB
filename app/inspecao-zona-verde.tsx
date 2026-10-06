import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import {
    useCallback,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

/* =========================================================
   TIPOS
========================================================= */

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

type Fonte = 'manual' | 'biobeetlia';

type Leitura = {
  arvoreId: string;

  temperatura: number | null;
  umidadeAr: number | null;
  umidadeSolo: number | null;
  luminosidade: number | null;
  inclinacao: number | null;

  observacoes: string;

  coletadoEm: string;
};

type Inspecao = {
  id: string;

  numero: number;

  areaId: 'zona-verde-01';

  fonte: Fonte;

  arvoreIds: string[];

  leituras: Leitura[];

  criadoEm: string;

  finalizadoEm: string;

  demo?: boolean;
};

type Tela =
  | 'central'
  | 'selecionar'
  | 'fonte'
  | 'manual'
  | 'resultado';

type Draft = {
  temperatura: string;
  umidadeAr: string;
  umidadeSolo: string;
  luminosidade: string;
  inclinacao: string;
  observacoes: string;
};

/* =========================================================
   CORES
========================================================= */

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

  warning: '#EBCB67',
};

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_ARVORES = 'arvores';

const STORAGE_INSPECOES =
  'inspecoes_zona_verde_v1';

/* =========================================================
   HELPERS
========================================================= */

function media(
  leituras: Leitura[],
  chave:
    | 'temperatura'
    | 'umidadeAr'
    | 'umidadeSolo'
    | 'luminosidade'
    | 'inclinacao'
) {
  const valores =
    leituras
      .map(
        (item) =>
          item[chave]
      )
      .filter(
        (
          item
        ): item is number =>
          typeof item ===
          'number'
      );

  if (
    valores.length === 0
  ) {
    return null;
  }

  const soma =
    valores.reduce(
      (total, atual) =>
        total + atual,
      0
    );

  return Number(
    (
      soma /
      valores.length
    ).toFixed(1)
  );
}

function formatarData(
  valor: string
) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return 'Data indisponível';
  }

  return data.toLocaleDateString(
    'pt-BR'
  );
}

function criarDraft(): Draft {
  return {
    temperatura: '',
    umidadeAr: '',
    umidadeSolo: '',
    luminosidade: '',
    inclinacao: '',
    observacoes: '',
  };
}

function converterNumero(
  valor: string
) {
  if (
    !valor.trim()
  ) {
    return null;
  }

  const numero =
    Number(
      valor.replace(
        ',',
        '.'
      )
    );

  if (
    Number.isNaN(numero)
  ) {
    return null;
  }

  return numero;
}

/* =========================================================
   POSIÇÕES DO MAPA
========================================================= */

const PONTOS_MAPA =
  Array.from(
    {
      length: 24,
    },

    (_, index) => {
      const col =
        index % 6;

      const row =
        Math.floor(
          index / 6
        );

      return {
        x:
          8 +
          col * 16 +
          (row % 2 === 0
            ? 2
            : 7),

        y:
          18 +
          row * 20 +
          ((index % 3) *
            2),
      };
    }
  );

/* =========================================================
   COMPONENTE
========================================================= */

export default function InspecaoZonaVerde() {
  const [tela, setTela] =
    useState<Tela>(
      'central'
    );

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  const [
    arvores,
    setArvores,
  ] =
    useState<Arvore[]>([]);

  const [
    inspecoes,
    setInspecoes,
  ] =
    useState<
      Inspecao[]
    >([]);

  const [
    selecionadas,
    setSelecionadas,
  ] =
    useState<string[]>(
      []
    );

  const [
    indiceManual,
    setIndiceManual,
  ] =
    useState(0);

  const [
    drafts,
    setDrafts,
  ] =
    useState<
      Record<
        string,
        Draft
      >
    >({});

  const [
    leiturasManual,
    setLeiturasManual,
  ] =
    useState<
      Record<
        string,
        Leitura
      >
    >({});

  const [
    resultado,
    setResultado,
  ] =
    useState<
      Inspecao | null
    >(null);

  /* =======================================================
     CARREGAR
  ======================================================= */

  const carregar =
    useCallback(async () => {
      try {
        setCarregando(
          true
        );

        const [
          jsonArvores,
          jsonInspecoes,
        ] =
          await Promise.all([
            AsyncStorage.getItem(
              STORAGE_ARVORES
            ),

            AsyncStorage.getItem(
              STORAGE_INSPECOES
            ),
          ]);

        const listaArvores:
          Arvore[] =
          jsonArvores
            ? JSON.parse(
                jsonArvores
              )
            : [];

        const listaInspecoes:
          Inspecao[] =
          jsonInspecoes
            ? JSON.parse(
                jsonInspecoes
              )
            : [];

        listaInspecoes.sort(
          (a, b) =>
            new Date(
              b.finalizadoEm
            ).getTime() -
            new Date(
              a.finalizadoEm
            ).getTime()
        );

        setArvores(
          listaArvores
        );

        setInspecoes(
          listaInspecoes
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      } finally {
        setCarregando(
          false
        );
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  /* =======================================================
     INSPEÇÃO EXIBIDA
  ======================================================= */

  const inspecaoAtual =
    inspecoes.length > 0
      ? inspecoes[0]
      : null;

  const total =
    arvores.length;

  const monitoradas =
    inspecaoAtual
      ? inspecaoAtual.arvoreIds.length
      : 0;

  const progresso =
    inspecaoAtual &&
    total > 0
      ? Math.round(
          (monitoradas /
            total) *
            100
        )
      : 0;

  const mediaTemp =
    inspecaoAtual
      ? media(
          inspecaoAtual.leituras,
          'temperatura'
        )
      : null;

  const mediaAr =
    inspecaoAtual
      ? media(
          inspecaoAtual.leituras,
          'umidadeAr'
        )
      : null;

  const mediaSolo =
    inspecaoAtual
      ? media(
          inspecaoAtual.leituras,
          'umidadeSolo'
        )
      : null;

  const mediaLuz =
    inspecaoAtual
      ? media(
          inspecaoAtual.leituras,
          'luminosidade'
        )
      : null;

  const mediaInclinacao =
    inspecaoAtual
      ? media(
          inspecaoAtual.leituras,
          'inclinacao'
        )
      : null;

  const preview =
    arvores.slice(
      0,
      4
    );

  /* =======================================================
     MISSÃO
  ======================================================= */

  function iniciarInspecao() {
    if (arvores.length === 0) {
      Alert.alert(
        'Nenhuma árvore cadastrada',
        'Cadastre pelo menos uma árvore antes de iniciar uma inspeção.'
      );

      return;
    }

    setSelecionadas([]);
    setDrafts({});
    setLeiturasManual({});
    setIndiceManual(0);

    setTela(
      'selecionar'
    );
  }

  function alternarArvore(
    id: string
  ) {
    setSelecionadas(
      (atual) => {
        if (
          atual.includes(
            id
          )
        ) {
          return atual.filter(
            (item) =>
              item !== id
          );
        }

        return [
          ...atual,
          id,
        ];
      }
    );
  }

  function selecionarTodas() {
    if (
      selecionadas.length ===
      arvores.length
    ) {
      setSelecionadas(
        []
      );
    } else {
      setSelecionadas(
        arvores.map(
          (arvore) =>
            arvore.id
        )
      );
    }
  }

  /* =======================================================
     MANUAL
  ======================================================= */

  const arvoreAtualId =
    selecionadas[
      indiceManual
    ];

  const arvoreAtual =
    arvores.find(
      (item) =>
        item.id ===
        arvoreAtualId
    );

  const draftAtual =
    arvoreAtualId
      ? drafts[
          arvoreAtualId
        ] ??
        criarDraft()
      : criarDraft();

  const qtdSalvas =
    Object.keys(
      leiturasManual
    ).length;

  function atualizarDraft(
    campo:
      keyof Draft,
    valor: string
  ) {
    if (
      !arvoreAtualId
    ) {
      return;
    }

    setDrafts(
      (atual) => ({
        ...atual,

        [arvoreAtualId]: {
          ...(
            atual[
              arvoreAtualId
            ] ??
            criarDraft()
          ),

          [campo]:
            valor,
        },
      })
    );
  }

  function salvarLeitura() {
    if (
      !arvoreAtualId
    ) {
      return;
    }

    const draft =
      drafts[
        arvoreAtualId
      ] ??
      criarDraft();

    const temInformacao =
      draft.temperatura.trim() ||
      draft.umidadeAr.trim() ||
      draft.umidadeSolo.trim() ||
      draft.luminosidade.trim() ||
      draft.inclinacao.trim() ||
      draft.observacoes.trim();

    if (
      !temInformacao
    ) {
      Alert.alert(
        'Nenhum dado informado',
        'Digite ao menos uma medição ou observação antes de salvar esta árvore.'
      );

      return;
    }

    const leitura:
      Leitura = {
      arvoreId:
        arvoreAtualId,

      temperatura:
        converterNumero(
          draft.temperatura
        ),

      umidadeAr:
        converterNumero(
          draft.umidadeAr
        ),

      umidadeSolo:
        converterNumero(
          draft.umidadeSolo
        ),

      luminosidade:
        converterNumero(
          draft.luminosidade
        ),

      inclinacao:
        converterNumero(
          draft.inclinacao
        ),

      observacoes:
        draft.observacoes.trim(),

      coletadoEm:
        new Date().toISOString(),
    };

    setLeiturasManual(
      (atual) => ({
        ...atual,

        [arvoreAtualId]:
          leitura,
      })
    );

    if (
      indiceManual <
      selecionadas.length -
        1
    ) {
      setIndiceManual(
        (atual) =>
          atual + 1
      );
    }
  }

  async function finalizarManual() {
    if (
      qtdSalvas <
      selecionadas.length
    ) {
      Alert.alert(
        'Missão incompleta',
        `Ainda faltam ${
          selecionadas.length -
          qtdSalvas
        } árvore(s).`
      );

      return;
    }

    const agora =
      new Date().toISOString();

    const proximoNumero =
      inspecoes.length > 0
        ? Math.max(
            ...inspecoes.map(
              (item) =>
                item.numero
            )
          ) + 1
        : 1;

    const nova:
      Inspecao = {
      id: `ZV-${String(
        proximoNumero
      ).padStart(
        3,
        '0'
      )}`,

      numero:
        proximoNumero,

      areaId:
        'zona-verde-01',

      fonte:
        'manual',

      arvoreIds: [
        ...selecionadas,
      ],

      leituras:
        Object.values(
          leiturasManual
        ),

      criadoEm:
        agora,

      finalizadoEm:
        agora,

      demo: false,
    };

    const novas = [
      nova,
      ...inspecoes,
    ];

    await AsyncStorage.setItem(
      STORAGE_INSPECOES,
      JSON.stringify(
        novas
      )
    );

    setInspecoes(
      novas
    );

    setResultado(
      nova
    );

    setTela(
      'resultado'
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    carregando
  ) {
    return (
      <View
        style={
          styles.loading
        }
      >
        <ActivityIndicator
          color={
            COLORS.lime
          }
          size="large"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Carregando Zona
          Verde...
        </Text>
      </View>
    );
  }

  /* =======================================================
     SELEÇÃO
  ======================================================= */

  if (
    tela ===
    'selecionar'
  ) {
    return (
      <View
        style={
          styles.screen
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <Back
            onPress={() =>
              setTela(
                'central'
              )
            }
          />

          <View
            style={
              styles.topLine
            }
          >
            <Text
              style={
                styles.eyebrow
              }
            >
              ZONA VERDE
            </Text>

            <Text
              style={
                styles.zoneIndex
              }
            >
              01
            </Text>
          </View>

          <Text
            style={
              styles.missionLabel
            }
          >
            NOVA INSPEÇÃO
          </Text>

          <Text
            style={
              styles.bigTitle
            }
          >
            Selecione as
            {'\n'}
            árvores
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Escolha os
            indivíduos que farão
            parte desta missão de
            inspeção.
          </Text>

          <View
            style={
              styles.selectionInfo
            }
          >
            <Text
              style={
                styles.selectionCount
              }
            >
              {
                selecionadas.length
              }
            </Text>

            <Text
              style={
                styles.selectionText
              }
            >
              de{' '}
              {arvores.length}{' '}
              selecionadas
            </Text>

            <TouchableOpacity
              style={
                styles.selectAll
              }
              onPress={
                selecionarTodas
              }
            >
              <Text
                style={
                  styles.selectAllText
                }
              >
                {selecionadas.length ===
                arvores.length
                  ? 'LIMPAR'
                  : 'SELECIONAR TODAS'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* MAPA */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            MAPA DA ÁREA
          </Text>

          <View
            style={
              styles.mapCard
            }
          >
            <View
              style={
                styles.mapPath1
              }
            />

            <View
              style={
                styles.mapPath2
              }
            />

            <Text
              style={
                styles.mapName
              }
            >
              ZONA VERDE
            </Text>

            {arvores
              .slice(
                0,
                24
              )
              .map(
                (
                  arvore,
                  index
                ) => {
                  const ativo =
                    selecionadas.includes(
                      arvore.id
                    );

                  const ponto =
                    PONTOS_MAPA[
                      index
                    ];

                  return (
                    <TouchableOpacity
                      key={
                        arvore.id
                      }
                      style={[
                        styles.mapPoint,
                        {
                          left:
                            `${ponto.x}%` as any,

                          top:
                            `${ponto.y}%` as any,
                        },

                        ativo &&
                          styles.mapPointActive,
                      ]}
                      onPress={() =>
                        alternarArvore(
                          arvore.id
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.mapPointText,

                          ativo &&
                            styles.mapPointTextActive,
                        ]}
                      >
                        {index +
                          1}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
          </View>

          {/* ÁRVORES */}

          <View
            style={
              styles.listHeader
            }
          >
            <Text
              style={
                styles.sectionTitleNoMargin
              }
            >
              ÁRVORES DA ÁREA
            </Text>

            <Text
              style={
                styles.listTotal
              }
            >
              {
                arvores.length
              }
            </Text>
          </View>

          {arvores.map(
            (
              arvore,
              index
            ) => {
              const ativo =
                selecionadas.includes(
                  arvore.id
                );

              return (
                <TouchableOpacity
                  key={
                    arvore.id
                  }
                  style={[
                    styles.treeRow,

                    ativo &&
                      styles.treeRowActive,
                  ]}
                  onPress={() =>
                    alternarArvore(
                      arvore.id
                    )
                  }
                >
                  <Text
                    style={
                      styles.treeNumber
                    }
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      '0'
                    )}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.treeName
                      }
                    >
                      {
                        arvore.nome
                      }
                    </Text>

                    <Text
                      numberOfLines={
                        1
                      }
                      style={
                        styles.treeSpecies
                      }
                    >
                      {
                        arvore.especie
                      }
                    </Text>

                    <Text
                      style={
                        styles.treeLocation
                      }
                    >
                      {
                        arvore.local
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,

                      ativo &&
                        styles.radioActive,
                    ]}
                  >
                    {ativo && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )}

          {/* MISSÃO */}

          <View
            style={
              styles.missionCard
            }
          >
            <Text
              style={
                styles.missionCardLabel
              }
            >
              MISSÃO
            </Text>

            <Text
              style={
                styles.missionCardTitle
              }
            >
              {
                selecionadas.length
              }{' '}
              árvores
              selecionadas
            </Text>

            <Text
              numberOfLines={
                2
              }
              style={
                styles.missionIds
              }
            >
              {selecionadas.length >
              0
                ? selecionadas.join(
                    ' • '
                  )
                : 'Selecione ao menos uma árvore'}
            </Text>

            <TouchableOpacity
              disabled={
                selecionadas.length ===
                0
              }
              style={[
                styles.continueButton,

                selecionadas.length ===
                  0 &&
                  styles.disabled,
              ]}
              onPress={() =>
                setTela(
                  'fonte'
                )
              }
            >
              <Text
                style={
                  styles.continueText
                }
              >
                CONTINUAR
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={
                  COLORS.dark
                }
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* =======================================================
     FONTE
  ======================================================= */

  if (
    tela === 'fonte'
  ) {
    return (
      <View
        style={
          styles.screen
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <Back
            onPress={() =>
              setTela(
                'selecionar'
              )
            }
          />

          <Text
            style={
              styles.eyebrow
            }
          >
            NOVA INSPEÇÃO
          </Text>

          <Text
            style={
              styles.bigTitle
            }
          >
            Como deseja
            {'\n'}
            coletar?
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {
              selecionadas.length
            }{' '}
            árvores
            selecionadas · Zona
            Verde
          </Text>

          {/* BIOBEETLIA */}

          <View
            style={
              styles.robotSource
            }
          >
            <View
              style={
                styles.robotSourceTop
              }
            >
              <View
                style={
                  styles.robotIcon
                }
              >
                <Ionicons
                  name="hardware-chip-outline"
                  size={25}
                  color={
                    COLORS.dark
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.darkEyebrow
                  }
                >
                  BIOBEETLIA
                </Text>

                <Text
                  style={
                    styles.robotTitle
                  }
                >
                  Conectar robô
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.robotDescription
              }
            >
              Coleta assistida
              pelos sensores da
              plataforma terrestre.
            </Text>

            <View
              style={
                styles.offlineStatus
              }
            >
              <View
                style={
                  styles.offlineDot
                }
              />

              <Text
                style={
                  styles.offlineText
                }
              >
                Nenhum BioBeetlia
                conectado
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.searchRobot
              }
              onPress={() =>
                Alert.alert(
                  'Nenhum dispositivo conectado',
                  'A integração com a Raspberry Pi será feita futuramente por Wi-Fi/API. Nenhum dado foi criado ou recebido.'
                )
              }
            >
              <Text
                style={
                  styles.searchRobotText
                }
              >
                PROCURAR
                BIOBEETLIA
              </Text>

              <Ionicons
                name="wifi-outline"
                size={17}
                color={
                  COLORS.dark
                }
              />
            </TouchableOpacity>

            <Text
              style={
                styles.systemFlow
              }
            >
              sensores → Raspberry
              Pi → Wi-Fi/API → app →
              inspeção → árvore
            </Text>
          </View>

          {/* MANUAL */}

          <TouchableOpacity
            style={
              styles.manualSource
            }
            onPress={() => {
              setIndiceManual(
                0
              );

              setTela(
                'manual'
              );
            }}
          >
            <View
              style={
                styles.manualIcon
              }
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={
                  COLORS.lime
                }
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.manualEyebrow
                }
              >
                DISPONÍVEL AGORA
              </Text>

              <Text
                style={
                  styles.manualTitle
                }
              >
                Inspeção manual
              </Text>

              <Text
                style={
                  styles.manualText
                }
              >
                Registre as
                medições
                diretamente no
                aplicativo.
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                COLORS.lime
              }
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /* =======================================================
     MANUAL
  ======================================================= */

  if (
    tela === 'manual' &&
    arvoreAtual
  ) {
    return (
      <View
        style={
          styles.screen
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          <Back
            onPress={() =>
              setTela(
                'fonte'
              )
            }
          />

          <Text
            style={
              styles.eyebrow
            }
          >
            INSPEÇÃO MANUAL
          </Text>

          <Text
            style={
              styles.bigTitle
            }
          >
            Missão em
            {'\n'}
            andamento
          </Text>

          <View
            style={
              styles.manualProgressTop
            }
          >
            <Text
              style={
                styles.manualProgressText
              }
            >
              {indiceManual +
                1}{' '}
              de{' '}
              {
                selecionadas.length
              }
            </Text>

            <Text
              style={
                styles.manualSaved
              }
            >
              {qtdSalvas}{' '}
              salvas
            </Text>
          </View>

          <View
            style={
              styles.progressTrack
            }
          >
            <View
              style={[
                styles.progressFill,

                {
                  width:
                    `${
                      ((indiceManual +
                        1) /
                        selecionadas.length) *
                      100
                    }%` as any,
                },
              ]}
            />
          </View>

          <View
            style={
              styles.currentTree
            }
          >
            <View
              style={
                styles.currentTreeIcon
              }
            >
              <Ionicons
                name="leaf"
                size={23}
                color={
                  COLORS.dark
                }
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.currentTreeCode
                }
              >
                {
                  arvoreAtual.id
                }
              </Text>

              <Text
                style={
                  styles.currentTreeName
                }
              >
                {
                  arvoreAtual.nome
                }
              </Text>

              <Text
                style={
                  styles.currentTreeLocation
                }
              >
                {
                  arvoreAtual.local
                }
              </Text>
            </View>

            {leiturasManual[
              arvoreAtual.id
            ] && (
              <Ionicons
                name="checkmark-circle"
                size={21}
                color={
                  COLORS.green
                }
              />
            )}
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            DADOS AMBIENTAIS
          </Text>

          <View
            style={
              styles.formCard
            }
          >
            <CampoMedicao
              icon="thermometer-outline"
              label="Temperatura"
              unit="°C"
              value={
                draftAtual.temperatura
              }
              onChange={(v) =>
                atualizarDraft(
                  'temperatura',
                  v
                )
              }
            />

            <Divider />

            <CampoMedicao
              icon="water-outline"
              label="Umidade do ar"
              unit="%"
              value={
                draftAtual.umidadeAr
              }
              onChange={(v) =>
                atualizarDraft(
                  'umidadeAr',
                  v
                )
              }
            />

            <Divider />

            <CampoMedicao
              icon="leaf-outline"
              label="Umidade do solo"
              unit="%"
              value={
                draftAtual.umidadeSolo
              }
              onChange={(v) =>
                atualizarDraft(
                  'umidadeSolo',
                  v
                )
              }
            />

            <Divider />

            <CampoMedicao
              icon="sunny-outline"
              label="Luminosidade"
              unit="%"
              value={
                draftAtual.luminosidade
              }
              onChange={(v) =>
                atualizarDraft(
                  'luminosidade',
                  v
                )
              }
            />

            <Divider />

            <CampoMedicao
              icon="speedometer-outline"
              label="Inclinação"
              unit="°"
              value={
                draftAtual.inclinacao
              }
              onChange={(v) =>
                atualizarDraft(
                  'inclinacao',
                  v
                )
              }
            />
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            OBSERVAÇÕES
          </Text>

          <TextInput
            value={
              draftAtual.observacoes
            }
            onChangeText={(v) =>
              atualizarDraft(
                'observacoes',
                v
              )
            }
            multiline
            style={
              styles.notes
            }
            placeholder="Condição observada, interferências, características..."
            placeholderTextColor={
              COLORS.muted2
            }
          />

          <TouchableOpacity
            style={
              styles.saveReading
            }
            onPress={
              salvarLeitura
            }
          >
            <Text
              style={
                styles.saveReadingText
              }
            >
              SALVAR LEITURA
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={
                COLORS.dark
              }
            />
          </TouchableOpacity>

          <View
            style={
              styles.manualNav
            }
          >
            <TouchableOpacity
              disabled={
                indiceManual ===
                0
              }
              style={[
                styles.manualNavButton,

                indiceManual ===
                  0 &&
                  styles.disabled,
              ]}
              onPress={() =>
                setIndiceManual(
                  (atual) =>
                    Math.max(
                      0,
                      atual - 1
                    )
                )
              }
            >
              <Ionicons
                name="arrow-back"
                size={16}
                color={
                  COLORS.white
                }
              />

              <Text
                style={
                  styles.manualNavText
                }
              >
                ANTERIOR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                indiceManual ===
                selecionadas.length -
                  1
              }
              style={[
                styles.manualNavButton,

                indiceManual ===
                  selecionadas.length -
                    1 &&
                  styles.disabled,
              ]}
              onPress={() =>
                setIndiceManual(
                  (atual) =>
                    Math.min(
                      selecionadas.length -
                        1,
                      atual + 1
                    )
                )
              }
            >
              <Text
                style={
                  styles.manualNavText
                }
              >
                PRÓXIMA
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={
                  COLORS.white
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={
              qtdSalvas <
              selecionadas.length
            }
            style={[
              styles.finishButton,

              qtdSalvas <
                selecionadas.length &&
                styles.disabled,
            ]}
            onPress={
              finalizarManual
            }
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={19}
              color={
                COLORS.lime
              }
            />

            <Text
              style={
                styles.finishButtonText
              }
            >
              FINALIZAR INSPEÇÃO
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /* =======================================================
     RESULTADO
  ======================================================= */

  if (
    tela ===
      'resultado' &&
    resultado
  ) {
    const mTemp =
      media(
        resultado.leituras,
        'temperatura'
      );

    const mAr =
      media(
        resultado.leituras,
        'umidadeAr'
      );

    const mSolo =
      media(
        resultado.leituras,
        'umidadeSolo'
      );

    const mLuz =
      media(
        resultado.leituras,
        'luminosidade'
      );

    return (
      <View
        style={
          styles.screen
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <Back
            onPress={() =>
              setTela(
                'central'
              )
            }
          />

          <Text
            style={
              styles.eyebrow
            }
          >
            {
              resultado.id
            }
          </Text>

          <Text
            style={
              styles.bigTitle
            }
          >
            Inspeção
            {'\n'}
            concluída
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Os dados foram
            associados aos
            indivíduos desta
            missão.
          </Text>

          <View
            style={
              styles.resultHero
            }
          >
            <Text
              style={
                styles.resultNumber
              }
            >
              {
                resultado
                  .arvoreIds
                  .length
              }
            </Text>

            <Text
              style={
                styles.resultLabel
              }
            >
              ÁRVORES
              INSPECIONADAS
            </Text>
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            MÉDIAS
          </Text>

          <View
            style={
              styles.metricsGrid
            }
          >
            <Metric
              icon="thermometer-outline"
              value={
                mTemp === null
                  ? '—'
                  : `${mTemp}°`
              }
              label="Temperatura"
            />

            <Metric
              icon="water-outline"
              value={
                mAr === null
                  ? '—'
                  : `${mAr}%`
              }
              label="Umidade"
            />

            <Metric
              icon="leaf-outline"
              value={
                mSolo === null
                  ? '—'
                  : `${mSolo}%`
              }
              label="Solo"
            />

            <Metric
              icon="sunny-outline"
              value={
                mLuz === null
                  ? '—'
                  : `${mLuz}%`
              }
              label="Luminosidade"
            />
          </View>

          <TouchableOpacity
            style={
              styles.backHomeButton
            }
            onPress={() =>
              setTela(
                'central'
              )
            }
          >
            <Text
              style={
                styles.backHomeText
              }
            >
              VOLTAR À ZONA
              VERDE
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={
                COLORS.dark
              }
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /* =======================================================
     CENTRAL
  ======================================================= */

  return (
    <View
      style={styles.screen}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <Back
          onPress={() =>
            router.back()
          }
        />

        <View
          style={
            styles.topLine
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            ÁREA PILOTO · ZONA
          </Text>

          <Text
            style={
              styles.zoneIndex
            }
          >
            01
          </Text>
        </View>

        <Text
          style={
            styles.pageTitle
          }
        >
          Zona Verde
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Acompanhe como esta área
          muda ao longo do tempo.
        </Text>

        {/* VISÃO GERAL */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          VISÃO GERAL
        </Text>

        <View
          style={
            styles.overviewRow
          }
        >
          <View
            style={
              styles.overviewMain
            }
          >
            <Ionicons
              name="leaf"
              size={21}
              color={
                COLORS.dark
              }
            />

            <Text
              style={
                styles.overviewNumber
              }
            >
              {total}
            </Text>

            <Text
              style={
                styles.overviewLabel
              }
            >
              ÁRVORES
              CADASTRADAS
            </Text>
          </View>

          <View
            style={
              styles.overviewSide
            }
          >
            <View>
              <Text
                style={
                  styles.overviewSideNumber
                }
              >
                {
                  monitoradas
                }
              </Text>

              <Text
                style={
                  styles.overviewSideText
                }
              >
                monitoradas
              </Text>
            </View>

            <View
              style={
                styles.overviewDivider
              }
            />

            <View>
              <Text
                style={
                  styles.overviewSideNumber
                }
              >
                {progresso}%
              </Text>

              <Text
                style={
                  styles.overviewSideText
                }
              >
                cobertura
              </Text>
            </View>
          </View>
        </View>

        {/* INSPEÇÃO */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitleNoMargin
            }
          >
            ÚLTIMA INSPEÇÃO
          </Text>

          {inspecaoAtual && (
            <Text
              style={
                styles.inspectionId
              }
            >
              {inspecaoAtual.id}
            </Text>
          )}
        </View>

        {!inspecaoAtual ? (
          <View
            style={
              styles.inspectionCard
            }
          >
            <View
              style={
                styles.emptyInspectionIcon
              }
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={
                  COLORS.lime
                }
              />
            </View>

            <Text
              style={
                styles.emptyInspectionTitle
              }
            >
              Nenhuma inspeção concluída
            </Text>

            <Text
              style={
                styles.emptyInspectionText
              }
            >
              Sua primeira inspeção criará o histórico desta área.
            </Text>

            <View
              style={
                styles.cardDivider
              }
            />

            <Text
              style={
                styles.emptyInspectionFlow
              }
            >
              ÁREA → ÁRVORES → MISSÃO → FONTE → DADOS → HISTÓRICO
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.inspectionCard
            }
          >
            <View
              style={
                styles.inspectionTop
              }
            >
              <View>
                <Text
                  style={
                    styles.inspectionId
                  }
                >
                  {
                    inspecaoAtual.id
                  }
                </Text>

                <Text
                  style={
                    styles.inspectionDate
                  }
                >
                  {formatarData(
                    inspecaoAtual.finalizadoEm
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.sourcePill
                }
              >
                <Ionicons
                  name={
                    inspecaoAtual.fonte ===
                    'manual'
                      ? 'create-outline'
                      : 'hardware-chip-outline'
                  }
                  size={13}
                  color={
                    COLORS.green
                  }
                />

                <Text
                  style={
                    styles.sourcePillText
                  }
                >
                  {inspecaoAtual.fonte ===
                  'manual'
                    ? 'MANUAL'
                    : 'BIOBEETLIA'}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.inspectionCountRow
              }
            >
              <Text
                style={
                  styles.inspectionBigNumber
                }
              >
                {
                  monitoradas
                }
              </Text>

              <Text
                style={
                  styles.inspectionCountText
                }
              >
                de {total}
                {'\n'}
                árvores
                monitoradas
              </Text>
            </View>

            <View
              style={
                styles.progressTrack
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${Math.min(
                        progresso,
                        100
                      )}%` as any,
                  },
                ]}
              />
            </View>

            <Text
              style={
                styles.progressLabel
              }
            >
              {progresso}% da área
              cadastrada
            </Text>

            <View
              style={
                styles.cardDivider
              }
            />

            <Text
              style={
                styles.metricsTitle
              }
            >
              MÉDIAS AMBIENTAIS
            </Text>

            <View
              style={
                styles.metricsGrid
              }
            >
              <Metric
                icon="thermometer-outline"
                value={
                  mediaTemp === null
                    ? '—'
                    : `${mediaTemp}°`
                }
                label="Temperatura"
              />

              <Metric
                icon="water-outline"
                value={
                  mediaAr === null
                    ? '—'
                    : `${mediaAr}%`
                }
                label="Umidade"
              />

              <Metric
                icon="leaf-outline"
                value={
                  mediaSolo === null
                    ? '—'
                    : `${mediaSolo}%`
                }
                label="Solo"
              />

              <Metric
                icon="sunny-outline"
                value={
                  mediaLuz === null
                    ? '—'
                    : `${mediaLuz}%`
                }
                label="Luminosidade"
              />
            </View>

            <View
              style={
                styles.extraMetric
              }
            >
              <Ionicons
                name="speedometer-outline"
                size={16}
                color={
                  COLORS.green
                }
              />

              <Text
                style={
                  styles.extraMetricText
                }
              >
                Inclinação média
              </Text>

              <Text
                style={
                  styles.extraMetricValue
                }
              >
                {mediaInclinacao ===
                null
                  ? '—'
                  : `${mediaInclinacao}°`}
              </Text>
            </View>
          </View>
        )}

        {/* ÁRVORES */}

        <View
          style={
            styles.listHeader
          }
        >
          <Text
            style={
              styles.sectionTitleNoMargin
            }
          >
            ÁRVORES
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                '/arvores' as any
              )
            }
          >
            <Text
              style={
                styles.seeAll
              }
            >
              VER TODAS →
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={
            styles.previewList
          }
        >
          {preview.map(
            (
              arvore,
              index
            ) => (
              <TouchableOpacity
                key={
                  arvore.id
                }
                style={[
                  styles.previewTree,

                  index !==
                    preview.length -
                      1 &&
                    styles.previewBorder,
                ]}
                onPress={() =>
                  router.push(
                    `/arvore/${arvore.id}` as any
                  )
                }
              >
                <View
                  style={
                    styles.previewIcon
                  }
                >
                  <Ionicons
                    name="leaf"
                    size={17}
                    color={
                      COLORS.dark
                    }
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.previewId
                    }
                  >
                    {
                      arvore.id
                    }
                  </Text>

                  <Text
                    style={
                      styles.previewName
                    }
                  >
                    {
                      arvore.nome
                    }
                  </Text>

                  <Text
                    numberOfLines={
                      1
                    }
                    style={
                      styles.previewMeta
                    }
                  >
                    {
                      arvore.especie
                    }{' '}
                    ·{' '}
                    {
                      arvore.local
                    }
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={
                    COLORS.green
                  }
                />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* REFAZER */}

        <TouchableOpacity
          style={
            styles.redoButton
          }
          onPress={
            iniciarInspecao
          }
        >
          <View
            style={
              styles.redoIcon
            }
          >
            <Ionicons
              name="refresh-outline"
              size={24}
              color={
                COLORS.dark
              }
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={
                styles.redoEyebrow
              }
            >
              MISSÃO DE
              MONITORAMENTO
            </Text>

            <Text
              style={
                styles.redoTitle
              }
            >
              {inspecaoAtual
                ? 'Nova inspeção'
                : 'Nova inspeção'}
            </Text>

            <Text
              style={
                styles.redoText
              }
            >
              Selecione os indivíduos e
              crie uma nova missão
              de monitoramento.
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={20}
            color={
              COLORS.dark
            }
          />
        </TouchableOpacity>

        <Text
          style={
            styles.footer
          }
        >
          ÁREA → ÁRVORES →
          INSPEÇÃO → FONTE →
          DADOS → HISTÓRICO
        </Text>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   SUBCOMPONENTES
========================================================= */

function Back({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.back}
      onPress={onPress}
    >
      <Ionicons
        name="arrow-back"
        size={19}
        color={COLORS.white}
      />

      <Text
        style={
          styles.backText
        }
      >
        Voltar
      </Text>
    </TouchableOpacity>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;

  value: string;

  label: string;
}) {
  return (
    <View
      style={
        styles.metricCard
      }
    >
      <Ionicons
        name={icon}
        size={15}
        color={COLORS.green}
      />

      <Text
        style={
          styles.metricValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.metricLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

function CampoMedicao({
  icon,
  label,
  unit,
  value,
  onChange,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;

  label: string;

  unit: string;

  value: string;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <View
      style={
        styles.measurement
      }
    >
      <View
        style={
          styles.measurementIcon
        }
      >
        <Ionicons
          name={icon}
          size={17}
          color={
            COLORS.lime
          }
        />
      </View>

      <Text
        style={
          styles.measurementLabel
        }
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={
          onChange
        }
        keyboardType="decimal-pad"
        placeholder="—"
        placeholderTextColor={
          COLORS.muted2
        }
        style={
          styles.measurementInput
        }
      />

      <Text
        style={
          styles.measurementUnit
        }
      >
        {unit}
      </Text>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={
        styles.divider
      }
    />
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        COLORS.bg,
    },

    loading: {
      flex: 1,

      backgroundColor:
        COLORS.bg,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    loadingText: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 10,

      marginTop: 12,
    },

    content: {
      paddingTop: 58,

      paddingHorizontal: 21,

      paddingBottom: 100,
    },

    back: {
      flexDirection: 'row',

      alignItems: 'center',

      alignSelf:
        'flex-start',

      marginBottom: 28,
    },

    backText: {
      color: COLORS.white,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 10,

      marginLeft: 7,
    },

    topLine: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    eyebrow: {
      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,

      letterSpacing: 1.8,
    },

    zoneIndex: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 10,
    },

    pageTitle: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 34,

      lineHeight: 39,

      marginTop: 6,
    },

    bigTitle: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 34,

      lineHeight: 40,

      marginTop: 8,
    },

    subtitle: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 10,

      lineHeight: 17,

      marginTop: 7,

      maxWidth: 300,
    },

    missionLabel: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      letterSpacing: 1.4,

      marginTop: 5,
    },

    sectionTitle: {
      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,

      letterSpacing: 1.3,

      marginTop: 29,

      marginBottom: 11,
    },

    sectionTitleNoMargin: {
      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,

      letterSpacing: 1.3,
    },

    sectionHeader: {
      marginTop: 29,

      marginBottom: 11,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    overviewRow: {
      flexDirection: 'row',

      minHeight: 127,
    },

    overviewMain: {
      width: '43%',

      backgroundColor:
        COLORS.lime,

      borderRadius: 23,

      padding: 15,

      justifyContent:
        'space-between',
    },

    overviewNumber: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 37,

      lineHeight: 39,
    },

    overviewLabel: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      lineHeight: 11,

      letterSpacing: 0.6,
    },

    overviewSide: {
      flex: 1,

      marginLeft: 10,

      backgroundColor:
        COLORS.card,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 23,

      padding: 15,

      justifyContent:
        'space-around',
    },

    overviewSideNumber: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 18,
    },

    overviewSideText: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 7,

      marginTop: 1,
    },

    overviewDivider: {
      height: 1,

      backgroundColor:
        COLORS.border,
    },

    demoBadge: {
      backgroundColor:
        COLORS.card2,

      paddingHorizontal: 8,

      paddingVertical: 4,

      borderRadius: 100,
    },

    demoBadgeText: {
      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 0.8,
    },

    inspectionCard: {
      backgroundColor:
        COLORS.card,

      borderRadius: 23,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      padding: 16,
    },

    emptyInspectionIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: COLORS.card2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    emptyInspectionTitle: {
      color: COLORS.white,
      fontFamily: 'Poppins_700Bold',
      fontSize: 14,
    },

    emptyInspectionText: {
      color: COLORS.muted,
      fontFamily: 'Poppins_400Regular',
      fontSize: 9,
      lineHeight: 15,
      marginTop: 5,
      maxWidth: 270,
    },

    emptyInspectionFlow: {
      color: COLORS.green,
      fontFamily: 'Poppins_700Bold',
      fontSize: 6.5,
      letterSpacing: 0.55,
      lineHeight: 11,
    },


    inspectionTop: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',
    },

    inspectionId: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      letterSpacing: 0.8,
    },

    inspectionDate: {
      color: COLORS.white,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 11,

      marginTop: 2,
    },

    sourcePill: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.card2,

      borderRadius: 100,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    sourcePillText: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      marginLeft: 4,
    },

    inspectionCountRow: {
      marginTop: 17,

      flexDirection: 'row',

      alignItems:
        'flex-end',
    },

    inspectionBigNumber: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 40,

      lineHeight: 42,
    },

    inspectionCountText: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 7.5,

      lineHeight: 11,

      marginLeft: 8,

      marginBottom: 3,
    },

    progressTrack: {
      height: 6,

      borderRadius: 100,

      backgroundColor:
        COLORS.card2,

      overflow: 'hidden',

      marginTop: 14,
    },

    progressFill: {
      height: '100%',

      backgroundColor:
        COLORS.lime,
    },

    progressLabel: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 6.5,

      marginTop: 5,
    },

    cardDivider: {
      height: 1,

      backgroundColor:
        COLORS.border,

      marginTop: 15,

      marginBottom: 13,
    },

    metricsTitle: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6.5,

      letterSpacing: 1,
    },

    metricsGrid: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      justifyContent:
        'space-between',

      marginTop: 10,
    },

    metricCard: {
      width: '48.5%',

      minHeight: 82,

      backgroundColor:
        COLORS.card2,

      borderRadius: 16,

      padding: 11,

      marginBottom: 9,
    },

    metricValue: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 17,

      marginTop: 7,
    },

    metricLabel: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 6.5,

      marginTop: 1,
    },

    extraMetric: {
      minHeight: 42,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.card2,

      borderRadius: 14,

      paddingHorizontal: 11,
    },

    extraMetricText: {
      flex: 1,

      color: COLORS.muted,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 7.5,

      marginLeft: 7,
    },

    extraMetricValue: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 10,
    },

    demoNotice: {
      marginTop: 12,

      flexDirection: 'row',

      alignItems:
        'flex-start',

      backgroundColor:
        '#132A1A',

      borderRadius: 14,

      padding: 10,
    },

    demoNoticeText: {
      flex: 1,

      color: COLORS.muted2,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 6.5,

      lineHeight: 10,

      marginLeft: 6,
    },

    listHeader: {
      marginTop: 29,

      marginBottom: 11,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    seeAll: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      letterSpacing: 0.7,
    },

    previewList: {
      backgroundColor:
        COLORS.card,

      borderRadius: 21,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      paddingHorizontal: 13,
    },

    previewTree: {
      minHeight: 73,

      flexDirection: 'row',

      alignItems: 'center',
    },

    previewBorder: {
      borderBottomWidth: 1,

      borderBottomColor:
        COLORS.border,
    },

    previewIcon: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        COLORS.lime,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 10,
    },

    previewId: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6.5,
    },

    previewName: {
      color: COLORS.white,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 10,
    },

    previewMeta: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 6.5,

      marginTop: 2,
    },

    redoButton: {
      marginTop: 28,

      minHeight: 104,

      borderRadius: 24,

      backgroundColor:
        COLORS.lime,

      padding: 15,

      flexDirection: 'row',

      alignItems: 'center',
    },

    redoIcon: {
      width: 51,
      height: 51,

      borderRadius: 16,

      backgroundColor:
        COLORS.limeDark,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 12,
    },

    redoEyebrow: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 0.8,
    },

    redoTitle: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 16,

      marginTop: 1,
    },

    redoText: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 7,

      lineHeight: 11,

      marginTop: 2,

      maxWidth: 210,
    },

    footer: {
      color: COLORS.muted2,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 0.5,

      textAlign: 'center',

      marginTop: 18,
    },

    selectionInfo: {
      marginTop: 23,

      minHeight: 82,

      backgroundColor:
        COLORS.lime,

      borderRadius: 21,

      paddingHorizontal: 15,

      flexDirection: 'row',

      alignItems: 'center',
    },

    selectionCount: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 27,
    },

    selectionText: {
      flex: 1,

      color: COLORS.medium,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 7.5,

      marginLeft: 6,
    },

    selectAll: {
      backgroundColor:
        COLORS.limeDark,

      borderRadius: 100,

      paddingHorizontal: 10,

      paddingVertical: 9,
    },

    selectAllText: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 0.5,
    },

    mapCard: {
      height: 240,

      backgroundColor:
        '#183822',

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      overflow: 'hidden',

      position: 'relative',
    },

    mapPath1: {
      position:
        'absolute',

      width: 260,
      height: 70,

      backgroundColor:
        '#1F442A',

      borderRadius: 80,

      transform: [
        {
          rotate:
            '-17deg',
        },
      ],

      top: 38,

      left: -40,
    },

    mapPath2: {
      position:
        'absolute',

      width: 250,
      height: 60,

      borderWidth: 1,

      borderColor:
        COLORS.medium,

      borderRadius: 80,

      transform: [
        {
          rotate:
            '24deg',
        },
      ],

      bottom: 15,

      right: -60,
    },

    mapName: {
      position:
        'absolute',

      bottom: 12,

      left: 15,

      color:
        COLORS.muted2,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 1,
    },

    mapPoint: {
      position:
        'absolute',

      width: 25,
      height: 25,

      borderRadius: 13,

      backgroundColor:
        COLORS.card2,

      borderWidth: 1,

      borderColor:
        COLORS.medium,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    mapPointActive: {
      backgroundColor:
        COLORS.lime,

      borderColor:
        COLORS.lime,
    },

    mapPointText: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,
    },

    mapPointTextActive: {
      color: COLORS.dark,
    },

    listTotal: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,
    },

    treeRow: {
      minHeight: 77,

      backgroundColor:
        COLORS.card,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      padding: 12,

      marginBottom: 9,

      flexDirection: 'row',

      alignItems: 'center',
    },

    treeRowActive: {
      borderColor:
        COLORS.lime,

      backgroundColor:
        COLORS.card2,
    },

    treeNumber: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 11,

      width: 33,
    },

    treeName: {
      color: COLORS.white,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 10,
    },

    treeSpecies: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 6.5,
    },

    treeLocation: {
      color: COLORS.green,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 6,

      marginTop: 2,
    },

    radio: {
      width: 23,
      height: 23,

      borderRadius: 12,

      borderWidth: 1.5,

      borderColor:
        COLORS.medium,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    radioActive: {
      borderColor:
        COLORS.lime,
    },

    radioInner: {
      width: 11,
      height: 11,

      borderRadius: 6,

      backgroundColor:
        COLORS.lime,
    },

    missionCard: {
      marginTop: 22,

      backgroundColor:
        COLORS.card3,

      borderRadius: 23,

      padding: 16,
    },

    missionCardLabel: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 1,
    },

    missionCardTitle: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 15,

      marginTop: 3,
    },

    missionIds: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 7,

      lineHeight: 12,

      marginTop: 5,
    },

    continueButton: {
      minHeight: 48,

      backgroundColor:
        COLORS.lime,

      borderRadius: 15,

      marginTop: 14,

      paddingHorizontal: 14,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    continueText: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7.5,

      letterSpacing: 0.8,
    },

    disabled: {
      opacity: 0.35,
    },

    robotSource: {
      marginTop: 25,

      backgroundColor:
        COLORS.lime,

      borderRadius: 25,

      padding: 17,
    },

    robotSourceTop: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    robotIcon: {
      width: 48,
      height: 48,

      borderRadius: 15,

      backgroundColor:
        COLORS.limeDark,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 11,
    },

    darkEyebrow: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6.5,

      letterSpacing: 1,
    },

    robotTitle: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 15,
    },

    robotDescription: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 8.5,

      lineHeight: 14,

      marginTop: 17,
    },

    offlineStatus: {
      marginTop: 17,

      minHeight: 43,

      backgroundColor:
        '#C8DA69',

      borderRadius: 14,

      paddingHorizontal: 12,

      flexDirection: 'row',

      alignItems: 'center',
    },

    offlineDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      backgroundColor:
        COLORS.medium,

      marginRight: 7,
    },

    offlineText: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 8,
    },

    searchRobot: {
      minHeight: 48,

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        COLORS.medium,

      marginTop: 10,

      paddingHorizontal: 13,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    searchRobotText: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      letterSpacing: 0.7,
    },

    systemFlow: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 6,

      textAlign: 'center',

      marginTop: 11,
    },

    manualSource: {
      marginTop: 12,

      minHeight: 101,

      backgroundColor:
        COLORS.card,

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      padding: 14,

      flexDirection: 'row',

      alignItems: 'center',
    },

    manualIcon: {
      width: 46,
      height: 46,

      borderRadius: 14,

      backgroundColor:
        COLORS.card2,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 11,
    },

    manualEyebrow: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6,

      letterSpacing: 0.8,
    },

    manualTitle: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 12,

      marginTop: 1,
    },

    manualText: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 7,

      lineHeight: 11,

      marginTop: 3,
    },

    manualProgressTop: {
      marginTop: 24,

      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    manualProgressText: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 9,
    },

    manualSaved: {
      color: COLORS.green,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 7,
    },

    currentTree: {
      minHeight: 86,

      marginTop: 20,

      backgroundColor:
        COLORS.card,

      borderRadius: 21,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      padding: 13,

      flexDirection: 'row',

      alignItems: 'center',
    },

    currentTreeIcon: {
      width: 48,
      height: 48,

      borderRadius: 15,

      backgroundColor:
        COLORS.lime,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 11,
    },

    currentTreeCode: {
      color: COLORS.green,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,
    },

    currentTreeName: {
      color: COLORS.white,

      fontFamily:
        'Poppins_600SemiBold',

      fontSize: 11,
    },

    currentTreeLocation: {
      color: COLORS.muted,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 7,

      marginTop: 2,
    },

    formCard: {
      backgroundColor:
        COLORS.card,

      borderRadius: 21,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      paddingHorizontal: 13,
    },

    measurement: {
      minHeight: 63,

      flexDirection: 'row',

      alignItems: 'center',
    },

    measurementIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        COLORS.card2,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 9,
    },

    measurementLabel: {
      flex: 1,

      color: COLORS.white,

      fontFamily:
        'Poppins_500Medium',

      fontSize: 8.5,
    },

    measurementInput: {
      width: 63,

      minHeight: 39,

      borderRadius: 11,

      backgroundColor:
        COLORS.card2,

      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 11,

      textAlign: 'center',
    },

    measurementUnit: {
      width: 29,

      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,

      textAlign: 'right',
    },

    divider: {
      height: 1,

      backgroundColor:
        COLORS.border,
    },

    notes: {
      minHeight: 110,

      backgroundColor:
        COLORS.card,

      borderRadius: 19,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      padding: 13,

      color: COLORS.white,

      fontFamily:
        'Poppins_400Regular',

      fontSize: 9,

      lineHeight: 15,

      textAlignVertical:
        'top',
    },

    saveReading: {
      minHeight: 52,

      backgroundColor:
        COLORS.lime,

      borderRadius: 17,

      marginTop: 20,

      paddingHorizontal: 15,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    saveReadingText: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 8,

      letterSpacing: 0.7,
    },

    manualNav: {
      marginTop: 10,

      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    manualNavButton: {
      minHeight: 42,

      backgroundColor:
        COLORS.card,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 14,

      paddingHorizontal: 11,

      flexDirection: 'row',

      alignItems: 'center',
    },

    manualNavText: {
      color: COLORS.white,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 6.5,

      marginHorizontal: 6,
    },

    finishButton: {
      marginTop: 20,

      minHeight: 53,

      borderWidth: 1,

      borderColor:
        COLORS.lime,

      borderRadius: 17,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',
    },

    finishButtonText: {
      color: COLORS.lime,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7.5,

      letterSpacing: 0.8,

      marginLeft: 7,
    },

    resultHero: {
      marginTop: 25,

      backgroundColor:
        COLORS.lime,

      borderRadius: 24,

      padding: 17,
    },

    resultNumber: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 43,

      lineHeight: 46,
    },

    resultLabel: {
      color: COLORS.medium,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7,

      letterSpacing: 1,
    },

    backHomeButton: {
      marginTop: 22,

      minHeight: 54,

      backgroundColor:
        COLORS.lime,

      borderRadius: 17,

      paddingHorizontal: 15,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    backHomeText: {
      color: COLORS.dark,

      fontFamily:
        'Poppins_700Bold',

      fontSize: 7.5,

      letterSpacing: 0.8,
    },
  });