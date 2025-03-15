# QR Code Scanner App

Este aplicativo foi desenvolvido para permitir o escaneamento e gerenciamento de QR Codes.
### Etapas do Desenvolvimento

#### 1️⃣ Implementação do Escaneamento de QR Codes
O primeiro passo foi integrar a funcionalidade de leitura de QR Codes utilizando a câmera do dispositivo, para isso eu usei a biblioteca **Expo Camera**. Implementei o componente `<CameraView>` dentro da tela principal (`index.jsx`), configurado para detectar apenas códigos QR por meio da propriedade `barcodeScannerSettings`. Quando um QR Code é escaneado, a função `handleCamera` é chamada, armazenando o dado escaneado no estado do aplicativo e exibindo um alerta ao usuário.

#### 2️⃣ Criação do Histórico de QR Codes
Foi feita uma tela de histórico onde o usuário pode ver todos os qrcodes escaneados, ela foi implementada em `historico.jsx`, utilizando um componente `<FlatList>`. Essa tela exibe os QR Codes armazenados em uma lista ordenada, cada item da lista inclui o QR Code armazenado e a data/hora do escaneamento, também adicionei um botão para limpar o histórico.

#### 3️⃣ Implementação da Persistência de Dados
Para garantir que os QR Codes escaneados não fossem perdidos ao fechar o aplicativo, implementei a persistência de dados utilizando **AsyncStorage**. Criei duas funções: `loadQrList` para carregar os QR Codes armazenados ao iniciar o aplicativo e `saveQrList` para salvar a lista sempre que houver uma alteração. O `useEffect` foi utilizado para monitorar mudanças na lista e atualizar o armazenamento automaticamente.

#### 4️⃣ Alternância entre Câmera Frontal e Traseira
Para oferecer maior flexibilidade ao usuário, adicionei a opção de alternar entre a câmera frontal e traseira do dispositivo. Essa funcionalidade foi implementada adicionando um estado `facing`, que controla qual câmera está ativa.

#### 5️⃣ Implementação do Modo Escuro
Com o objetivo de melhorar a experiência visual, implementei um **modo escuro** que pode ser ativado ou desativado conforme a preferência do usuário. Criei um estado `darkMode`, que define a aparência do aplicativo dinamicamente.

#### 6️⃣ Adição de Compartilhamento de QR Codes
Para aumentar a utilidade do aplicativo, foi incluido a opção de **compartilhar QR Codes** escaneados. O compartilhamento de QR Codes foi implementado utilizando a API `Share` do React Native. Na tela de histórico, adicionei um evento `onLongPress` em cada item da lista, permitindo que o usuário compartilhe o conteúdo do QR Code com outros aplicativos ao pressioná-lo por alguns segundos.

#### 7️⃣ Melhorias na Interface do Usuário
Para tornar a navegação mais fluida, realizei diversas melhorias na interface do usuário. Foram adicionados botões interativos com ícones personalizados, também implementei um contador de QR Codes escaneados, permitindo que o usuário veja a quantidade de registros salvos.
