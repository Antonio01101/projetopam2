import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Link } from "expo-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function HomeScreen() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      console.log('🌐 Buscando clientes em:', `${API_URL}/clientes`);
      
      const response = await axios.get(`${API_URL}/clientes`);
      console.log('✅ Clientes recebidos:', response.data);
      setClientes(response.data);
      
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      
      try {
        console.log('🔄 Tentando rota raiz como fallback...');
        const response = await axios.get(API_URL);
        console.log('✅ Dados recebidos da rota raiz:', response.data);
        setClientes(response.data);
      } catch (fallbackError) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const testarConexao = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      Alert.alert('✅ Conexão OK', 'Backend respondendo perfeitamente!');
    } catch (error) {
      Alert.alert('❌ Erro', 'Verifique se o backend está rodando');
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📋 Lista de Clientes</Text>

      <View style={styles.botoesContainer}>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.botaoAdd}>
            <Text style={styles.botaoTexto}>➕ Adicionar</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/edit" asChild>
        <TouchableOpacity style={styles.botaoRefresh} onPress={carregarClientes}>
          <Text style={styles.botaoTexto}>🔄 Atualizar</Text>
        </TouchableOpacity>
        </Link>
        <Link href="/delete" asChild>
          <TouchableOpacity style={{ ...styles.botao, ...styles.botaoDelete }}>
          <Text style={styles.botaoTexto}>🗑️ Excluir Cliente</Text>
          </TouchableOpacity>
      </Link>
      </View>

      <ScrollView style={styles.lista}>
        {clientes.length === 0 ? (
          <Text style={styles.vazio}>Nenhum cliente encontrado</Text>
        ) : (
          clientes.map((cliente) => (
            <View key={cliente.ID} style={styles.item}>
              <Text style={styles.nome}>{cliente.Nome}</Text>
              <Text style={styles.detalhe}>Idade: {cliente.Idade}</Text>
              <Text style={styles.detalhe}>UF: {cliente.UF}</Text>
              <Text style={styles.id}>ID: {cliente.ID}</Text>
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  botaoAdd: {
    backgroundColor: '#2521f3ff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  botaoRefresh: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },

  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  lista: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detalhe: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  id: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },

  botaoDelete: {
    backgroundColor: "#dc3545", 
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
},
});