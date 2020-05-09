import React, { useEffect, useState } from "react";
/**
 * useEffect -> Função adiciona a funcionalidade de executar efeitos através 
 *              de um componente funcional de API
 * useState  -> Função resevar este state entre re-renderizações se houve 
 *              ou não alteração 
 */

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

/**
 *  Importando para nosso aplicativo o arquivo de API
 */
import api from './services/api';


export default function App() {

  /**
   * Iniciando dos valores da variavel do tipo array utilizando a função 
   * useState, onde primeiro para metro é varkavel e segundo é um função
   * que será responsavel por realizar a atualização
   */
  const [repositories, setRepositories] = useState([]);

  /**
 * Essa função tem por finalidade pega os dados do backend atraves de um api
 * passada pelo frontend. atraves da api ele pega a rota e aguarda a resposta
 * quando responde ele adiciona no array atraves da função criada no State.
 */
  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {

    //Acessando os dados do diretorio like do nosso projeto repositores e adicionando na variavel response
    const response = await api.post(`repositories/${id}/like`);

    //Criado uma variavel "likeRepository" que tera os novos elemetos do response acima, vamos passar somente dados
    const likeRepository = response.data;

    //Para listar faz necessario pecorrer todo meu array para apresentar no browser se encontrar ID parecido realiza 
    //validação de apresentar
    const repositoriesUpdated = repositories.map(repository => {
      if (repository.id === id) {
        return likeRepository;
      } else {
        return repository;
      }
    });

    //Adicionando no array geral os novos elemento sem ter que excluir e criar novo
    setRepositories(repositoriesUpdated);
  }

  return (
    <>
      {/* Barra do Status de sua aplicação ou seja topo */}
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      {/* Organiza o conteúdo dentro dos limites da área segura de um dispositivo. */}
      <SafeAreaView style={styles.container}>

        {/* Exibe uma lista de rolagem de dados */}
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (

            <View style={styles.repositoryContainer}>

              {/* repository.title -> Retorna o Coteudo */}
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>

                {/* Para listar faz necessario pecorrer todo meu array para apresentar no browser */}
                {repository.techs.map(tech => (
                  //Lista as tecnologia registrada
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>


              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}

                  // Função maneira conveniente de definir o ID de teste para componentes React-Native
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}

                // Função que vai ser acionado ao preecionar o botão
                onPress={() => handleLikeRepository(repository.id)}

                // Função maneira conveniente de definir o ID de teste para componentes React-Native
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>



          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
