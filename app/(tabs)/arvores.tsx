import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Tabs, useFocusEffect } from 'expo-router';
import {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const COLORS = {
  bg: '#0E2115',

  card: '#17321F',
  card2: '#1D3D27',

  border: '#31583A',

  lime: '#DDEF77',
  limeDark: '#CADB6A',

  green: '#5ED163',
  medium: '#4B844E',

  white: '#F4F5ED',
  muted: '#A9BDAA',
  muted2: '#789079',

  danger: '#E77C7C',
  dangerBg: '#352728',
};

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

const ARVORES_DEMO: Arvore[] = Array.from(
  { length: 24 },
  (_, index) => {
    const numero = index + 1;

    return {
      id: `BB-${String(numero).padStart(3, '0')}`,
      nome: `Árvore ${String(numero).padStart(2, '0')}`,
      especie: especies[index % especies.length],
      local: locais[index % locais.length],
      observacoes:
        'Registro fictício utilizado para demonstração da plataforma BioBeetlia.',
      status: 'Sem leitura',
      criadoEm: new Date(
        2026,
        8,
        18,
        8,
        index
      ).toISOString(),
      demo: true,
    };
  }
);

export default function ArvoresScreen() {
  const [arvores, setArvores] =
    useState<Arvore[]>([]);

  const [busca, setBusca] =
    useState('');

  const carregarArvores =
    useCallback(async () => {
      try {
        const dadosSalvos =
          await AsyncStorage.getItem(
            'arvores'
          );

        const salvas: Arvore[] =
          dadosSalvos
            ? JSON.parse(dadosSalvos)
            : [];

        const mapa =
          new Map<string, Arvore>();

        /*
         * Base fixa com 24 árvores.
         */
        ARVORES_DEMO.forEach(
          (arvore) => {
            mapa.set(
              arvore.id,
              arvore
            );
          }
        );

        /*
         * Cadastros feitos pelo usuário.
         */
        salvas.forEach(
          (arvore) => {
            mapa.set(
              arvore.id,
              arvore
            );
          }
        );

        const lista =
          Array.from(
            mapa.values()
          ).sort((a, b) =>
            a.id.localeCompare(b.id)
          );

        setArvores(lista);

        await AsyncStorage.setItem(
          'arvores',
          JSON.stringify(lista)
        );
      } catch (error) {
        console.error(
          'Erro ao carregar árvores:',
          error
        );
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      carregarArvores();
    }, [carregarArvores])
  );

  async function excluirArvore(
    arvore: Arvore
  ) {
    if (arvore.demo) {
      Alert.alert(
        'Registro demonstrativo',
        'As 24 árvores DEMO fazem parte da base de apresentação e não podem ser apagadas.'
      );

      return;
    }

    Alert.alert(
      'Apagar árvore?',
      `Deseja remover ${arvore.id} — ${arvore.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Apagar',
          style: 'destructive',

          onPress: async () => {
            try {
              const novaLista =
                arvores.filter(
                  (item) =>
                    item.id !==
                    arvore.id
                );

              setArvores(
                novaLista
              );

              await AsyncStorage.setItem(
                'arvores',
                JSON.stringify(
                  novaLista
                )
              );

              await AsyncStorage.removeItem(
                `missao-robo-${arvore.id}`
              );
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível apagar este registro.'
              );
            }
          },
        },
      ]
    );
  }

  const filtradas =
    arvores.filter(
      (arvore) => {
        const texto =
          busca
            .trim()
            .toLowerCase();

        return (
          arvore.id
            .toLowerCase()
            .includes(texto) ||
          arvore.nome
            .toLowerCase()
            .includes(texto) ||
          arvore.especie
            .toLowerCase()
            .includes(texto) ||
          arvore.local
            .toLowerCase()
            .includes(texto)
        );
      }
    );

  const quantidadeDemo =
    arvores.filter(
      (arvore) =>
        arvore.demo
    ).length;

  const quantidadeCadastrada =
    arvores.length -
    quantidadeDemo;

  return (
    <View style={styles.screen}>
      <Tabs.Screen
        options={{
          headerShown: false,
          title: 'Árvores',
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
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
            size={19}
            color={COLORS.white}
          />

          <Text style={styles.backText}>
            Início
          </Text>
        </TouchableOpacity>

        {/* CABEÇALHO */}

        <Text style={styles.eyebrow}>
          BIOBEETLIA
        </Text>

        <Text style={styles.title}>
          Árvores
        </Text>

        <Text style={styles.subtitle}>
          Indivíduos registrados na plataforma.
        </Text>

        {/* RESUMO */}

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryNumber}>
              {arvores.length}
            </Text>

            <Text style={styles.summaryLabel}>
              registros
            </Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text
                style={
                  styles.summaryStatNumber
                }
              >
                {quantidadeDemo}
              </Text>

              <Text
                style={
                  styles.summaryStatLabel
                }
              >
                DEMO
              </Text>
            </View>

            <View
              style={
                styles.summaryDivider
              }
            />

            <View style={styles.summaryStat}>
              <Text
                style={
                  styles.summaryStatNumber
                }
              >
                {quantidadeCadastrada}
              </Text>

              <Text
                style={
                  styles.summaryStatLabel
                }
              >
                NOVAS
              </Text>
            </View>
          </View>
        </View>

        {/* BUSCA */}

        <View style={styles.search}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.muted}
          />

          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por ID, nome, espécie ou local..."
            placeholderTextColor={
              COLORS.muted2
            }
            style={styles.searchInput}
          />

          {busca.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                setBusca('')
              }
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.muted2}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* LISTA */}

        <View style={styles.listHeader}>
          <Text style={styles.listLabel}>
            REGISTROS
          </Text>

          <Text style={styles.listCount}>
            {filtradas.length}
          </Text>
        </View>

        {filtradas.map(
          (arvore) => (
            <View
              key={arvore.id}
              style={styles.treeCard}
            >
              <TouchableOpacity
                style={styles.treeOpen}
                activeOpacity={0.85}
                onPress={() =>
                  router.push(
                    `/arvore/${arvore.id}` as any
                  )
                }
              >
                <View
                  style={
                    styles.treeIcon
                  }
                >
                  <Ionicons
                    name="leaf"
                    size={22}
                    color={
                      COLORS.bg
                    }
                  />
                </View>

                <View style={styles.treeInfo}>
                  <View
                    style={styles.codeRow}
                  >
                    <Text
                      style={
                        styles.treeCode
                      }
                    >
                      {arvore.id}
                    </Text>

                    {arvore.demo ? (
                      <View
                        style={
                          styles.demoBadge
                        }
                      >
                        <Text
                          style={
                            styles.demoText
                          }
                        >
                          DEMO
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={
                          styles.userBadge
                        }
                      >
                        <Text
                          style={
                            styles.userBadgeText
                          }
                        >
                          CADASTRADA
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={
                      styles.treeName
                    }
                  >
                    {arvore.nome}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={
                      styles.species
                    }
                  >
                    {arvore.especie}
                  </Text>

                  <View
                    style={
                      styles.location
                    }
                  >
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={
                        COLORS.muted
                      }
                    />

                    <Text
                      numberOfLines={1}
                      style={
                        styles.locationText
                      }
                    >
                      {arvore.local}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* AÇÕES */}

              <View style={styles.actions}>
                {!arvore.demo && (
                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      excluirArvore(
                        arvore
                      )
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={19}
                      color={
                        COLORS.danger
                      }
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={
                    styles.forwardButton
                  }
                  onPress={() =>
                    router.push(
                      `/arvore/${arvore.id}` as any
                    )
                  }
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.lime}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        )}

        {/* SEM RESULTADO */}

        {filtradas.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="leaf-outline"
              size={35}
              color={COLORS.lime}
            />

            <Text style={styles.emptyTitle}>
              Nenhuma árvore encontrada
            </Text>

            <Text style={styles.emptyText}>
              Tente buscar por outro nome, ID,
              espécie ou localização.
            </Text>
          </View>
        )}

        {/* AVISO */}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.lime}
          />

          <Text style={styles.noticeText}>
            As 24 árvores DEMO ficam disponíveis para
            apresentação. Registros cadastrados
            manualmente podem ser removidos pela lixeira.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /*
   * ESSA É A PARTE QUE CORRIGE
   * O VAZIO GIGANTE.
   */
  content: {
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 120,

    /*
     * Não tem:
     * flexGrow: 1
     * justifyContent: center
     * alignItems: center
     */
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    marginBottom: 23,
  },

  backText: {
    color: COLORS.white,

    fontFamily:
      'Poppins_500Medium',

    fontSize: 11,

    marginLeft: 7,
  },

  eyebrow: {
    color: COLORS.lime,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 8,

    letterSpacing: 1.8,
  },

  title: {
    color: COLORS.white,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 31,

    lineHeight: 36,

    marginTop: 3,
  },

  subtitle: {
    color: COLORS.muted,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 10,

    marginTop: 3,
  },

  summary: {
    minHeight: 94,

    marginTop: 21,

    borderRadius: 22,

    paddingHorizontal: 18,

    backgroundColor:
      COLORS.lime,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',
  },

  summaryNumber: {
    color: COLORS.bg,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 36,

    lineHeight: 39,
  },

  summaryLabel: {
    color: COLORS.medium,

    fontFamily:
      'Poppins_500Medium',

    fontSize: 8,
  },

  summaryStats: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  summaryStat: {
    minWidth: 48,

    alignItems: 'center',
  },

  summaryStatNumber: {
    color: COLORS.bg,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 18,
  },

  summaryStatLabel: {
    color: COLORS.medium,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 6,

    letterSpacing: 0.7,
  },

  summaryDivider: {
    width: 1,
    height: 35,

    backgroundColor:
      '#C3D667',

    marginHorizontal: 9,
  },

  search: {
    height: 49,

    marginTop: 17,

    borderRadius: 16,

    borderWidth: 1,
    borderColor:
      COLORS.border,

    backgroundColor:
      COLORS.card,

    paddingHorizontal: 14,

    flexDirection: 'row',

    alignItems: 'center',
  },

  searchInput: {
    flex: 1,

    color: COLORS.white,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 10,

    marginLeft: 8,

    marginRight: 8,
  },

  listHeader: {
    marginTop: 23,
    marginBottom: 10,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',
  },

  listLabel: {
    color: COLORS.lime,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 8,

    letterSpacing: 1.3,
  },

  listCount: {
    color: COLORS.muted,

    fontFamily:
      'Poppins_600SemiBold',

    fontSize: 8,
  },

  treeCard: {
    minHeight: 92,

    marginBottom: 11,

    backgroundColor:
      COLORS.card,

    borderRadius: 20,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    flexDirection: 'row',

    alignItems: 'center',

    overflow: 'hidden',
  },

  treeOpen: {
    flex: 1,

    minHeight: 90,

    paddingLeft: 13,
    paddingVertical: 12,

    flexDirection: 'row',

    alignItems: 'center',
  },

  treeIcon: {
    width: 49,
    height: 49,

    borderRadius: 15,

    backgroundColor:
      COLORS.lime,

    alignItems: 'center',

    justifyContent:
      'center',

    marginRight: 12,
  },

  treeInfo: {
    flex: 1,
  },

  codeRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  treeCode: {
    color: COLORS.green,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 8,

    letterSpacing: 0.7,
  },

  demoBadge: {
    marginLeft: 7,

    backgroundColor:
      COLORS.card2,

    borderRadius: 100,

    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  demoText: {
    color: COLORS.lime,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 5.5,
  },

  userBadge: {
    marginLeft: 7,

    backgroundColor:
      '#264D30',

    borderRadius: 100,

    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  userBadgeText: {
    color: COLORS.green,

    fontFamily:
      'Poppins_700Bold',

    fontSize: 5.5,
  },

  treeName: {
    color: COLORS.white,

    fontFamily:
      'Poppins_600SemiBold',

    fontSize: 12,

    marginTop: 2,
  },

  species: {
    color: COLORS.muted,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 7.5,

    marginTop: 1,
  },

  location: {
    marginTop: 5,

    flexDirection: 'row',

    alignItems: 'center',
  },

  locationText: {
    flex: 1,

    color: COLORS.muted,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 7.5,

    marginLeft: 4,
  },

  actions: {
    minWidth: 51,

    alignSelf: 'stretch',

    alignItems: 'center',

    justifyContent: 'center',

    paddingRight: 8,

    paddingVertical: 9,

    gap: 3,
  },

  deleteButton: {
    width: 37,
    height: 37,

    borderRadius: 12,

    backgroundColor:
      COLORS.dangerBg,

    alignItems: 'center',

    justifyContent:
      'center',
  },

  forwardButton: {
    width: 37,
    height: 32,

    alignItems: 'center',

    justifyContent:
      'center',
  },

  empty: {
    marginTop: 35,

    paddingVertical: 30,

    alignItems: 'center',
  },

  emptyTitle: {
    color: COLORS.white,

    fontFamily:
      'Poppins_600SemiBold',

    fontSize: 12,

    marginTop: 10,
  },

  emptyText: {
    color: COLORS.muted,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 8,

    lineHeight: 13,

    marginTop: 4,

    textAlign: 'center',

    maxWidth: 220,
  },

  notice: {
    marginTop: 16,

    backgroundColor:
      COLORS.card2,

    borderRadius: 16,

    padding: 12,

    flexDirection: 'row',

    alignItems:
      'flex-start',
  },

  noticeText: {
    flex: 1,

    color: COLORS.muted2,

    fontFamily:
      'Poppins_400Regular',

    fontSize: 7,

    lineHeight: 11,

    marginLeft: 7,
  },
});