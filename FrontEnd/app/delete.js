import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import API_URL from "../api";

export default function DeleteCliente() {
  const [id, setId] = useState("");
  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const buscarCliente = async () => {
    if (!id) {
      setMensagem("⚠️ Digite um ID primeiro!");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");
      console.log('🔍 Buscando cliente ID:', id);
      
      const response = await axios.get(`${API_URL}/clientes/${id}`);
      console.log('✅ Resposta da busca:', response.data);
      
      const clienteEncontrado = response.data[0];
      
      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
        setMensagem("✅ Cliente encontrado! Confirme os dados para exclusão.");
        console.log('📋 Dados do cliente:', clienteEncontrado);
      } else {
        setCliente(null);
        setMensagem("❌ Cliente não encontrado!");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar:", error);
      setCliente(null);
      if (error.response?.status === 404) {
        setMensagem("❌ Cliente não encontrado!");
      } else {
        setMensagem("❌ Erro ao buscar cliente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const excluirCliente = async () => {
    if (!id || !cliente) {
      setMensagem("⚠️ Busque um cliente primeiro!");
      return;
    }

    try {
      setCarregando(true);
      console.log('🗑️ Tentando excluir cliente ID:', id);
      
      const response = await axios.delete(`${API_URL}/clientes/${id}`);
      console.log('✅ Resposta do servidor:', response.data);
      
      if (response.data.deleted) {
        Alert.alert(
          "✅ Sucesso", 
          `Cliente "${cliente.Nome}" excluído com sucesso!`,
          [
            {
              text: "OK",
              onPress: () => {
                setId("");
                setCliente(null);
                setMensagem("");
              }
            }
          ]
        );
      } else {
        Alert.alert("❌ Erro", "Cliente não foi excluído.");
      }
      
    } catch (error) {
      console.error("❌ Erro completo na exclusão:", error);
      
      let errorMsg = "❌ Erro ao excluir cliente";
      if (error.response) {
        errorMsg = `❌ Erro ${error.response.status}: ${error.response.data?.error || 'Erro no servidor'}`;
      } else if (error.request) {
        errorMsg = "❌ Servidor não respondeu";
      }
      
      Alert.alert("❌ Erro", errorMsg);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarExclusao = () => {
    if (!cliente) return;

    const shouldDelete = window.confirm(
      `⚠️ Confirmar Exclusão\n\nTem certeza que deseja EXCLUIR PERMANENTEMENTE o cliente:\n\n${cliente.Nome} - ID: ${cliente.ID}\nIdade: ${cliente.Idade} - UF: ${cliente.UF}\n\nClique em OK para confirmar ou Cancelar para voltar.`
    );

    if (shouldDelete) {
      console.log('✅ Usuário confirmou exclusão');
      excluirCliente();
    } else {
      console.log('❌ Usuário cancelou exclusão');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🗑️ Excluir Cliente</Text>

      <Text style={styles.label}>ID do Cliente para Exclusão:</Text>
      <View style={styles.buscaContainer}>
        <TextInput
          style={[styles.input, styles.inputId]}
          value={id}
          onChangeText={setId}
          placeholder="Digite o ID do cliente"
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.botao, styles.botaoBuscar]} 
          onPress={buscarCliente}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? "⏳" : "🔍"} Buscar
          </Text>
        </TouchableOpacity>
      </View>

      {cliente && (
        <View style={styles.cardCliente}>
          <Text style={styles.cardTitulo}>Cliente para Exclusão</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}><Text style={styles.cardLabel}>ID:</Text> {cliente.ID}</Text>
            <Text style={styles.cardText}><Text style={styles.cardLabel}>Nome:</Text> {cliente.Nome}</Text>
            <Text style={styles.cardText}><Text style={styles.cardLabel}>Idade:</Text> {cliente.Idade}</Text>
            <Text style={styles.cardText}><Text style={styles.cardLabel}>UF:</Text> {cliente.UF}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.botao, styles.botaoExcluir, carregando && styles.botaoDesabilitado]} 
            onPress={confirmarExclusao}
            disabled={carregando}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "⏳ Processando..." : "🗑️ EXCLUIR CLIENTE"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {mensagem ? (
        <Text style={[
          styles.mensagem, 
          mensagem.includes('✅') ? styles.sucesso : styles.erro
        ]}>
          {mensagem}
        </Text>
      ) : null}

      <View style={styles.instrucoes}>
        <Text style={styles.instrucoesTitulo}>Para testar:</Text>
        <Text style={styles.instrucoesTexto}>1. Digite um ID existente (ex: 4)</Text>
        <Text style={styles.instrucoesTexto}>2. Clique em "Buscar"</Text>
        <Text style={styles.instrucoesTexto}>3. Verifique se os dados estão corretos</Text>
        <Text style={styles.instrucoesTexto}>4. Clique em "EXCLUIR CLIENTE"</Text>
        <Text style={styles.instrucoesTexto}>5. Confirme a exclusão no popup</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#dc3545",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputId: {
    flex: 1,
  },
  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  botaoBuscar: {
    backgroundColor: "#17a2b8",
  },
  botaoExcluir: {
    backgroundColor: "#dc3545",
    marginTop: 15,
  },
  botaoDesabilitado: {
    backgroundColor: "#6c757d",
    opacity: 0.7,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardCliente: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
  },
  cardContent: {
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  cardLabel: {
    fontWeight: "600",
    color: "#495057",
  },
  mensagem: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sucesso: {
    backgroundColor: "#d4edda",
    color: "#155724",
    borderColor: "#c3e6cb",
  },
  erro: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderColor: "#f5c6cb",
  },
  instrucoes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#6c757d",
  },
  instrucoesTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 10,
  },
  instrucoesTexto: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
});