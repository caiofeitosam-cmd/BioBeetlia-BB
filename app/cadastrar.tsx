import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const ESPECIES = [
  'Mangueira — Mangifera indica',
  'Ipê-amarelo — Handroanthus albus',
  'Ipê-roxo — Handroanthus impetiginosus',
  'Oitizeiro — Licania tomentosa',
  'Cajueiro — Anacardium occidentale',
  'Pau-brasil — Paubrasilia echinata',
  'Outra espécie',
];

type ArvoreSalva = {
  id: string;
  nome: string;
  especie: string;
  local: string;
  observacoes: string;
  status: string;
  criadoEm: string;
};

export default function CadastrarArvore() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [outraEspecie, setOutraEspecie] = useState('');
  const [local, setLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function gerarProximoId(arvores: ArvoreSalva[]) {
    const numeros = arvores
      .map((arvore) => {
        const resultado = arvore.id?.match(/^BB-(\d+)$/);

        if (!resultado) {
          return 0;
        }

        return Number(resultado[1]);
      })
      .filter((numero) => numero > 0);

    const maiorNumero =
      numeros.length > 0
        ? Math.max(...numeros)
        : 0;

    return `BB-${String(maiorNumero + 1).padStart(3, '0')}`;
  }

  async function salvarArvore() {
    if (!nome.trim()) {
      Alert.alert(
        'Identificação necessária',
        'Digite um nome ou identificação para a árvore.'
      );

      return;
    }

    if (!especie) {
      Alert.alert(
        'Espécie necessária',
        'Selecione a espécie da árvore.'
      );

      return;
    }

    if (
      especie === 'Outra espécie' &&
      !outraEspecie.trim()
    ) {
      Alert.alert(
        'Qual é a espécie?',
        'Digite o nome da espécie antes de continuar.'
      );

      return;
    }

    if (!local.trim()) {
      Alert.alert(
        'Localização necessária',
        'Informe onde a árvore está localizada.'
      );

      return;
    }

    try {
      setSalvando(true);

      const dadosSalvos =
        await AsyncStorage.getItem('arvores');

      const arvores: ArvoreSalva[] =
        dadosSalvos
          ? JSON.parse(dadosSalvos)
          : [];

      const novoId =
        await gerarProximoId(arvores);

      const especieFinal =
        especie === 'Outra espécie'
          ? outraEspecie.trim()
          : especie;

      const novaArvore: ArvoreSalva = {
        id: novoId,
        nome: nome.trim(),
        especie: especieFinal,
        local: local.trim(),
        observacoes: observacoes.trim(),
        status: 'Sem leitura',
        criadoEm: new Date().toISOString(),
      };

      const novasArvores = [
        ...arvores,
        novaArvore,
      ];

      await AsyncStorage.setItem(
        'arvores',
        JSON.stringify(novasArvores)
      );

      Alert.alert(
        'Árvore cadastrada 🌱',
        `${novoId} foi adicionada ao BioBeetlia.`,
        [
          {
            text: 'Ver árvores',
            onPress: () =>
              router.replace('/arvores' as any),
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar a árvore.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={COLORS.nevoaBotanica}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              BIOBEETLIA
            </Text>

            <Text style={styles.title}>
              Nova árvore
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Registre um novo indivíduo para acompanhamento
          ambiental.
        </Text>

        {/* IDENTIFICAÇÃO */}

        <Text style={styles.sectionTitle}>
          IDENTIFICAÇÃO
        </Text>

        <View style={styles.card}>
          <FieldLabel
            icon="pricetag-outline"
            text="Nome ou identificação"
          />

          <TextInput
            style={styles.input}
            placeholder="Ex.: Mangueira do pátio"
            placeholderTextColor="#728B74"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.helperText}>
            O código BB será criado automaticamente.
          </Text>
        </View>

        {/* ESPÉCIE */}

        <Text style={styles.sectionTitle}>
          ESPÉCIE
        </Text>

        <View style={styles.card}>
          <FieldLabel
            icon="leaf-outline"
            text="Selecione a espécie"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especie}
              onValueChange={(itemValue) =>
                setEspecie(itemValue)
              }
              style={styles.picker}
              dropdownIconColor={
                COLORS.luzRegenerativa
              }
              itemStyle={styles.pickerItem}
            >
              <Picker.Item
                label="Selecione uma espécie..."
                value=""
              />

              {ESPECIES.map((item) => (
                <Picker.Item
                  key={item}
                  label={item}
                  value={item}
                />
              ))}
            </Picker>
          </View>

          {especie === 'Outra espécie' && (
            <View style={styles.otherSpecies}>
              <TextInput
                style={styles.input}
                placeholder="Digite a espécie"
                placeholderTextColor="#728B74"
                value={outraEspecie}
                onChangeText={setOutraEspecie}
              />
            </View>
          )}
        </View>

        {/* LOCALIZAÇÃO */}

        <Text style={styles.sectionTitle}>
          LOCALIZAÇÃO
        </Text>

        <View style={styles.card}>
          <FieldLabel
            icon="location-outline"
            text="Local"
          />

          <TextInput
            style={styles.input}
            placeholder="Ex.: Área verde lateral"
            placeholderTextColor="#728B74"
            value={local}
            onChangeText={setLocal}
          />

          <TouchableOpacity
            style={styles.gpsButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="navigate-outline"
              size={17}
              color={COLORS.luzRegenerativa}
            />

            <Text style={styles.gpsText}>
              Capturar coordenadas GPS
            </Text>

            <View style={styles.futureBadge}>
              <Text style={styles.futureText}>
                EM BREVE
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* OBSERVAÇÕES */}

        <Text style={styles.sectionTitle}>
          OBSERVAÇÕES
        </Text>

        <View style={styles.card}>
          <FieldLabel
            icon="document-text-outline"
            text="Informações adicionais"
          />

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            placeholder="Condição aparente, características, informações importantes..."
            placeholderTextColor="#728B74"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
          />
        </View>

        {/* PREVIEW */}

        <Text style={styles.sectionTitle}>
          REGISTRO
        </Text>

        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <Ionicons
              name="leaf"
              size={23}
              color={COLORS.mataProfunda}
            />
          </View>

          <View style={styles.previewText}>
            <Text style={styles.previewTitle}>
              Novo indivíduo
            </Text>

            <Text style={styles.previewSubtitle}>
              O BioBeetlia atribuirá um ID único BB-XXX
              após o cadastro.
            </Text>
          </View>
        </View>

        {/* SALVAR */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            salvando && styles.saveButtonDisabled,
          ]}
          onPress={salvarArvore}
          disabled={salvando}
          activeOpacity={0.85}
        >
          <Ionicons
            name={
              salvando
                ? 'hourglass-outline'
                : 'add-circle-outline'
            }
            size={21}
            color={COLORS.mataProfunda}
          />

          <Text style={styles.saveButtonText}>
            {salvando
              ? 'Salvando...'
              : 'Cadastrar árvore'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          BioBeetlia • Monitorar para prever. Prever para
          preservar.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.fieldLabel}>
      <Ionicons
        name={icon}
        size={16}
        color={COLORS.luzRegenerativa}
      />

      <Text style={styles.label}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.mataProfunda,
  },

  container: {
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.copaCientifica,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  headerText: {
    flex: 1,
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

    marginTop: -3,
  },

  subtitle: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 12,

    lineHeight: 19,

    marginTop: 14,

    maxWidth: 340,
  },

  sectionTitle: {
    color: COLORS.luzRegenerativa,

    fontFamily: 'Poppins_700Bold',

    fontSize: 11,

    letterSpacing: 1,

    marginTop: 28,

    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.copaCientifica,

    borderRadius: 20,

    padding: 15,
  },

  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 10,
  },

  label: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 11,

    marginLeft: 7,
  },

  input: {
    minHeight: 50,

    backgroundColor: COLORS.cardDark,

    borderWidth: 1,
    borderColor: '#355E39',

    borderRadius: 14,

    paddingHorizontal: 14,
    paddingVertical: 13,

    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_400Regular',

    fontSize: 12,
  },

  helperText: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 8,

    marginTop: 8,
  },

  pickerContainer: {
    backgroundColor: COLORS.cardDark,

    borderWidth: 1,
    borderColor: '#355E39',

    borderRadius: 14,

    overflow: 'hidden',
  },

  picker: {
    color: COLORS.nevoaBotanica,

    minHeight: 50,
  },

  pickerItem: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_400Regular',

    fontSize: 13,
  },

  otherSpecies: {
    marginTop: 12,
  },

  textArea: {
    height: 115,

    textAlignVertical: 'top',
  },

  gpsButton: {
    marginTop: 12,

    minHeight: 45,

    borderRadius: 13,

    borderWidth: 1,
    borderColor: COLORS.copaCientifica,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 13,
  },

  gpsText: {
    flex: 1,

    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_500Medium',

    fontSize: 9,

    marginLeft: 8,
  },

  futureBadge: {
    backgroundColor: COLORS.copaCientifica,

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 20,
  },

  futureText: {
    color: COLORS.luzRegenerativa,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 6,
  },

  previewCard: {
    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.copaCientifica,

    borderRadius: 20,

    padding: 15,

    flexDirection: 'row',

    alignItems: 'center',
  },

  previewIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: COLORS.luzRegenerativa,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  previewText: {
    flex: 1,
  },

  previewTitle: {
    color: COLORS.nevoaBotanica,

    fontFamily: 'Poppins_600SemiBold',

    fontSize: 12,
  },

  previewSubtitle: {
    color: COLORS.textMuted,

    fontFamily: 'Poppins_400Regular',

    fontSize: 8,

    lineHeight: 13,

    marginTop: 3,
  },

  saveButton: {
    marginTop: 28,

    minHeight: 56,

    borderRadius: 18,

    backgroundColor: COLORS.luzRegenerativa,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: COLORS.mataProfunda,

    fontFamily: 'Poppins_700Bold',

    fontSize: 12,

    marginLeft: 8,
  },

  footer: {
    color: '#718B73',

    fontFamily: 'Poppins_400Regular',

    fontSize: 7,

    textAlign: 'center',

    marginTop: 18,
  },
});