FROM almalinux:latest

# システムの更新とNode.jsのインストールに必要なパッケージをインストール
RUN dnf -y update && \
    dnf -y install --allowerasing curl wget tar gcc-c++ make

# Node.jsの最新LTSバージョンをインストール
ENV NODE_VERSION=18.x
RUN curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION} | bash - && \
    dnf -y install nodejs && \
    npm install -g npm@10.2.4

# 作業ディレクトリを設定
WORKDIR /app

# アプリケーションの依存関係をインストールするためのファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# アプリケーションのポートを公開
EXPOSE 3000

# 開発モードでの実行コマンド（ホットリロード用）
CMD ["npm", "run", "dev"] 