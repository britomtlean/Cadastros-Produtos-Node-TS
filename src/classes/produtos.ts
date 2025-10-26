export class Produto {
  id_produtos: number;
  produto_produtos: string;
  descricao_produtos: string | null;
  valor_produtos: any;
  estoque_produtos: any;
  imagem_produtos: any;

  constructor(
    id_produtos: number = 0,
    produto_produtos: string,
    descricao_produtos: string | null,
    valor_produtos: any,
    estoque_produtos: any,
    imagem_produtos?: any,
  ) {
    this.id_produtos = id_produtos;
    this.produto_produtos = produto_produtos;
    this.descricao_produtos = descricao_produtos;
    this.valor_produtos = valor_produtos;
    this.estoque_produtos = estoque_produtos;
    this.imagem_produtos = imagem_produtos;
  }
}
