import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Soldado extends BackGround {
    constructor() {
        super("soldado", ["Atletismo", "Intimidação"], 0, ["insígnia de patente", "fetiche obtido de um inimigo caído", "conjunto de dados de osso ou baralho", " conjunto de roupas comuns", "algibeira contendo 10 po"],
            ["kit de jogo", "veículos (terrestres)"],
            {
                nome: "PATENTE MILITAR",
                descricao: `
                  Você possui uma patente militar da sua época como soldado. Soldados leais à sua antiga organização reconhecem sua autoridade e influência, e o prestam deferência se forem de uma patente mais baixa. Você pode invocar sua patente para exercer influência sobre soldados, e requisitar equipamentos simples ou cavalos para uso temporário. Você também pode ganhar acesso a acampamentos militares aliados, e fortalezas onde sua patente é reconhecida.
                `,
            })
    }
}