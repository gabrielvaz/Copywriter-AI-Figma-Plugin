# AI Copywriter

Plugin do Figma que utiliza a API Gemini (Google AI) para gerar variações de textos a partir do conteúdo de um frame. Ele auxilia designers a criar rapidamente alternativas de copy diretamente dentro do Figma ou FigJam.

## Funcionalidades

- **Detecção automática de texto**: quando um frame é selecionado, o plugin identifica todas as camadas de texto com mais de três palavras e as exibe em uma lista.
- **Seleção dos textos**: cada trecho encontrado aparece com uma caixa de seleção para que você escolha quais partes deseja reescrever.
- **Configuração do tom e instruções**:
  - Campo para chave da API Gemini.
  - Seleção de tom de voz (profissional, casual, formal, informado, persuasivo ou amigável).
  - Definição do número de variações desejadas.
  - Área para instruções especiais que serão consideradas na geração do texto.
- **Geração de cópias**:
  - Envio dos textos selecionados e das configurações para a API Gemini.
  - Exibição das variações produzidas na interface do plugin.
  - Criação de cópias do frame original, colocando-as lado a lado, e substituição dos textos nos nós correspondentes em cada nova versão.
- **Atualização em tempo real**: a lista de textos é atualizada sempre que a seleção do Figma muda, sem precisar reiniciar o plugin.
- **Compatibilidade**: funciona tanto em arquivos Figma quanto FigJam.

## Instalação para desenvolvimento

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Gere os arquivos de distribuição:
   ```bash
   npm run build
   ```
   Durante o desenvolvimento você pode usar `npm run build:watch` para recompilar automaticamente a cada alteração.
3. No Figma, acesse **Plugins → Development → Import plugin from manifest…** e selecione o arquivo `manifest.json` deste projeto.

## Como usar no Figma

1. Abra o arquivo Figma ou FigJam e selecione um frame que contenha caixas de texto.
2. Execute o **AI Copywriter** a partir do menu de plugins.
3. Verifique a lista de textos detectados e marque aqueles que deseja reescrever.
4. Insira sua chave da API Gemini, escolha o tom de voz, defina a quantidade de variações e preencha as instruções adicionais, se houver.
5. Clique em **Generate Copy**. O plugin chamará a API, criará as cópias do frame e substituirá os textos nas respectivas camadas.
6. As variações geradas também aparecem na janela do plugin para consulta.
7. Use **Cancel** para fechar o plugin quando terminar.

## Licença

Este projeto está licenciado sob os termos da [licença MIT](LICENSE).
