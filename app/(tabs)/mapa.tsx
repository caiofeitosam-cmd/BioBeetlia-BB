import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

const COLORS = {
  luzRegenerativa: '#DDEF77',
  brotoInteligente: '#5ED163',
  copaCientifica: '#4B844E',
  nevoaBotanica: '#F4F5ED',
  mataProfunda: '#1B371E',

  card: '#244629',
  textMuted: '#B7C9B7',

  warning: '#EBCB67',
  danger: '#E97878',
};

const TREES = [
  {
    id: 'BB-001',
    species: 'Ipê-amarelo',
    status: 'Saudável',
    location: 'Entrada principal',
    latitude: -5.0892,
    longitude: -42.8019,
  },
  {
    id: 'BB-002',
    species: 'Mangueira',
    status: 'Atenção',
    location: 'Área verde lateral',
    latitude: -5.0895,
    longitude: -42.8015,
  },
  {
    id: 'BB-003',
    species: 'Neem',
    status: 'Saudável',
    location: 'Pátio da escola',
    latitude: -5.0889,
    longitude: -42.8013,
  },
  {
    id: 'BB-004',
    species: 'Oitizeiro',
    status: 'Crítico',
    location: 'Bloco B',
    latitude: -5.0897,
    longitude: -42.8021,
  },
];

export default function MapScreen() {
  const [satellite, setSatellite] = useState(false);

  const [selectedTree, setSelectedTree] =
    useState<(typeof TREES)[number] | null>(null);

  function getStatusColor(status: string) {
    if (status === 'Saudável') {
      return COLORS.brotoInteligente;
    }

    if (status === 'Atenção') {
      return COLORS.warning;
    }

    return COLORS.danger;
  }

  function openTree() {
    if (!selectedTree) return;

    router.push(`/arvore/${selectedTree.id}` as any);
  }

  return (
    <View style={styles.container}>
      {/* MAPA */}

      <MapView
        style={styles.map}
        mapType={satellite ? 'hybrid' : 'standard'}
        initialRegion={{
          latitude: -5.0892,
          longitude: -42.8017,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        {TREES.map((tree) => {
          const statusColor = getStatusColor(tree.status);

          return (
            <Marker
              key={tree.id}
              coordinate={{
                latitude: tree.latitude,
                longitude: tree.longitude,
              }}
              onPress={() => setSelectedTree(tree)}
            >
              <View
                style={[
                  styles.markerOuter,
                  {
                    borderColor: statusColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.markerInner,
                    {
                      backgroundColor: statusColor,
                    },
                  ]}
                >
                  <Ionicons
                    name="leaf"
                    size={17}
                    color={COLORS.mataProfunda}
                  />
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* FUNDO ESCURO DO CABEÇALHO */}

      <View
        style={styles.topOverlay}
        pointerEvents="none"
      />

      {/* CABEÇALHO */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            BIOBEETLIA
          </Text>

          <Text style={styles.title}>
            Mapa
          </Text>

          <Text style={styles.subtitle}>
            Vegetação monitorada em campo
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.mapTypeButton,
            satellite && styles.mapTypeButtonActive,
          ]}
          onPress={() => setSatellite(!satellite)}
        >
          <Ionicons
            name={satellite ? 'map' : 'earth-outline'}
            size={22}
            color={
              satellite
                ? COLORS.mataProfunda
                : COLORS.luzRegenerativa
            }
          />
        </TouchableOpacity>
      </View>

      {/* LEGENDA */}

      <View style={styles.legend}>
        <LegendItem
          color={COLORS.brotoInteligente}
          label="Saudável"
        />

        <LegendItem
          color={COLORS.warning}
          label="Atenção"
        />

        <LegendItem
          color={COLORS.danger}
          label="Crítico"
        />
      </View>

      {/* CONTADOR */}

      <View style={styles.counter}>
        <Ionicons
          name="leaf-outline"
          size={15}
          color={COLORS.luzRegenerativa}
        />

        <Text style={styles.counterText}>
          {TREES.length} árvores
        </Text>
      </View>

      {/* CARD DA ÁRVORE SELECIONADA */}

      {selectedTree && (
        <View style={styles.treeCard}>
          <View style={styles.treeCardTop}>
            <View
              style={[
                styles.treeIcon,
                {
                  backgroundColor: getStatusColor(
                    selectedTree.status
                  ),
                },
              ]}
            >
              <Ionicons
                name="leaf"
                size={22}
                color={COLORS.mataProfunda}
              />
            </View>

            <View style={styles.treeInfo}>
              <Text style={styles.treeId}>
                {selectedTree.id}
              </Text>

              <Text style={styles.treeSpecies}>
                {selectedTree.species}
              </Text>

              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={COLORS.textMuted}
                />

                <Text style={styles.locationText}>
                  {selectedTree.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTree(null)}
            >
              <Ionicons
                name="close"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.treeCardBottom}>
            <View>
              <Text style={styles.statusLabel}>
                STATUS
              </Text>

              <Text
                style={[
                  styles.statusValue,
                  {
                    color: getStatusColor(
                      selectedTree.status
                    ),
                  },
                ]}
              >
                {selectedTree.status}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={openTree}
            >
              <Text style={styles.detailsText}>
                Ver ficha
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={COLORS.mataProfunda}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* AVISO */}

      {!selectedTree && (
        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>
            Coordenadas demonstrativas do protótipo
          </Text>
        </View>
      )}
    </View>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text style={styles.legendText}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mataProfunda,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  topOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 180,

    backgroundColor: COLORS.mataProfunda,

    opacity: 0.94,
  },

  header: {
    position: 'absolute',

    top: 55,
    left: 20,
    right: 20,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  eyebrow: {
    color: COLORS.luzRegenerativa,

    fontSize: 9,

    letterSpacing: 2,

    fontFamily: 'Poppins_600SemiBold',
  },

  title: {
    color: COLORS.nevoaBotanica,

    fontSize: 30,

    fontFamily: 'Poppins_700Bold',

    marginTop: -2,
  },

  subtitle: {
    color: COLORS.textMuted,

    fontSize: 10,

    fontFamily: 'Poppins_400Regular',

    marginTop: -2,
  },

  mapTypeButton: {
    width: 48,
    height: 48,

    borderRadius: 15,

    borderWidth: 1,

    borderColor: COLORS.copaCientifica,

    backgroundColor: COLORS.card,

    justifyContent: 'center',

    alignItems: 'center',
  },

  mapTypeButtonActive: {
    backgroundColor: COLORS.luzRegenerativa,

    borderColor: COLORS.luzRegenerativa,
  },

  legend: {
    position: 'absolute',

    top: 150,
    left: 20,

    flexDirection: 'row',

    backgroundColor: COLORS.mataProfunda,

    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 50,

    borderWidth: 1,

    borderColor: COLORS.copaCientifica,
  },

  legendItem: {
    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 12,
  },

  legendDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 5,
  },

  legendText: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_400Regular',

    fontSize: 8,
  },

  counter: {
    position: 'absolute',

    top: 200,
    right: 20,

    backgroundColor: COLORS.mataProfunda,

    borderRadius: 50,

    paddingHorizontal: 11,
    paddingVertical: 7,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: COLORS.copaCientifica,
  },

  counterText: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_500Medium',

    fontSize: 9,

    marginLeft: 5,
  },

  markerOuter: {
    width: 42,
    height: 42,

    borderRadius: 21,

    borderWidth: 2,

    backgroundColor: COLORS.mataProfunda,

    alignItems: 'center',

    justifyContent: 'center',
  },

  markerInner: {
    width: 30,
    height: 30,

    borderRadius: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  treeCard: {
    position: 'absolute',

    left: 18,
    right: 18,

    bottom: 105,

    backgroundColor: COLORS.mataProfunda,

    borderRadius: 24,

    borderWidth: 1,

    borderColor: COLORS.copaCientifica,

    padding: 17,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.25,

    shadowRadius: 12,

    elevation: 8,
  },

  treeCardTop: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  treeIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,
  },

  treeInfo: {
    flex: 1,
  },

  treeId: {
    color: COLORS.luzRegenerativa,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 9,

    letterSpacing: 1,
  },

  treeSpecies: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_700Bold',

    fontSize: 16,
  },

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 3,
  },

  locationText: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 9,

    marginLeft: 3,
  },

  closeButton: {
    width: 30,
    height: 30,

    borderRadius: 10,

    backgroundColor: COLORS.card,

    alignItems: 'center',

    justifyContent: 'center',
  },

  cardDivider: {
    height: 1,

    backgroundColor: COLORS.copaCientifica,

    opacity: 0.5,

    marginVertical: 14,
  },

  treeCardBottom: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  statusLabel: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_500Medium',

    fontSize: 7,

    letterSpacing: 1,
  },

  statusValue: {
    fontFamily: 'Poppins_600SemiBold',

    fontSize: 11,

    marginTop: 2,
  },

  detailsButton: {
    backgroundColor: COLORS.luzRegenerativa,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 15,

    paddingVertical: 10,

    borderRadius: 13,
  },

  detailsText: {
    color: COLORS.mataProfunda,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 10,

    marginRight: 7,
  },

  demoNotice: {
    position: 'absolute',

    bottom: 105,

    alignSelf: 'center',

    backgroundColor: COLORS.mataProfunda,

    paddingHorizontal: 12,

    paddingVertical: 7,

    borderRadius: 40,

    borderWidth: 1,

    borderColor: COLORS.copaCientifica,
  },

  demoNoticeText: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 8,
  },
});