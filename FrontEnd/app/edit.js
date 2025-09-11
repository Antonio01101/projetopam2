import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import API_URL from "../api";

export default function EditCliente() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [uf, setUf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const buscarCliente = async () => {
    if (!id) {
      setMensagem("⚠️ Digite um ID primeiro!");
      return;
    }

    try {
      setCarregando(true);
      console.log('🔍 Buscando cliente ID:', id);
      
      const response = await axios.get(`${API_URL}/clientes/${id}`);
      const cliente = response.data[0];
      
      if (cliente) {
        setNome(cliente.Nome);
        setIdade(cliente.Idade.toString());
        setUf(cliente.UF);
        setMensagem("✅ Cliente encontrado! Preencha os novos dados.");
      } else {
        setMensagem("❌ Cliente não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setMensagem("❌ Erro ao buscar cliente.");
    } finally {
      setCarregando(false);
    }
  };

  const atualizarCliente = async () => {
    if (!id || !nome || !idade || !uf) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      setCarregando(true);
      console.log('🔄 Tentando atualizar:', { id, nome, idade, uf });
      
      const response = await axios.put(`${API_URL}/clientes/${id}`, {
        Nome: nome,
        Idade: parseInt(idade),
        UF: uf.toUpperCase(),
      });

      console.log('✅ Resposta:', response.data);
      
      setMensagem("✅ Cliente atualizado com sucesso!");
      
      setTimeout(() => {
        setId("");
        setNome("");
        setIdade("");
        setUf("");
        setMensagem("");
      }, 2000);
      
    } catch (error) {
      console.error("❌ Erro completo:", error);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
        setMensagem(`❌ Erro ${error.response.status}: ${error.response.data?.error || 'Erro no servidor'}`);
      } else if (error.request) {
        setMensagem("❌ Servidor não respondeu. Verifique se está rodando.");
      } else {
        setMensagem("❌ Erro: " + error.message);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>✏️ Editar Cliente</Text>

      <Text style={styles.label}>ID do Cliente:</Text>
      <View style={styles.buscaContainer}>
        <TextInput
          style={[styles.input, styles.inputId]}
          value={id}
          onChangeText={setId}
          placeholder="Digite o ID"
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={styles.botaoBuscar} 
          onPress={buscarCliente}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>🔍 Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Novo Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o novo nome"
        editable={!!id}
      />

      <Text style={styles.label}>Nova Idade:</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        placeholder="Digite a nova idade"
        keyboardType="numeric"
        editable={!!id}
      />

      <Text style={styles.label}>Nova UF:</Text>
      <TextInput
        style={styles.input}
        value={uf}
        onChangeText={setUf}
        placeholder="Ex: SP"
        maxLength={2}
        editable={!!id}
        autoCapitalize="characters"
      />

      <TouchableOpacity 
        style={[styles.botao, carregando && styles.botaoDesabilitado]} 
        onPress={atualizarCliente}
        disabled={carregando || !id}
      >
        <Text style={styles.botaoTexto}>
          {carregando ? "⏳ Atualizando..." : "💾 Atualizar"}
        </Text>
      </TouchableOpacity>

      {mensagem ? (
        <Text style={[
          styles.mensagem, 
          mensagem.includes('✅') ? styles.sucesso : styles.erro
        ]}>
          {mensagem}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  inputId: {
    flex: 1,
  },
  botao: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botaoBuscar: {
    backgroundColor: "#17a2b8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
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
});