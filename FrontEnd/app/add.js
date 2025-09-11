import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import API_URL from "../api";

export default function AddCliente() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [uf, setUf] = useState("");
  const [mensagem, setMensagem] = useState("");

  const cadastrarCliente = async () => {
    if (!nome || !idade || !uf) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      await axios.post(`${API_URL}/clientes`, {
        Nome: nome,
        Idade: idade,
        UF: uf,
      });

      setMensagem("✅ Cliente cadastrado com sucesso!");
      setNome("");
      setIdade("");
      setUf("");
    } catch (error) {
      console.error("Erro ao cadastrar:", error.message);
      setMensagem("❌ Erro ao cadastrar cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Cliente</Text>

      <Text>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text>Idade:</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        placeholder="Digite a idade"
        keyboardType="numeric"
      />

      <Text>UF:</Text>
      <TextInput
        style={styles.input}
        value={uf}
        onChangeText={setUf}
        placeholder="Ex: SP"
      />

      <TouchableOpacity style={styles.botao} onPress={cadastrarCliente}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  mensagem: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
});
