import characters from "./characters.js";
import promptSync from "prompt-sync";

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result

    switch (true) {
        case random < 0.33:
            result = "RETA"
            break;
        case random < 0.66:
            result = "CURVA"
            break;
        default:
            result = "CONFRONTO"
            break;
    }

    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`\n🏁 Rodada ${round} 🏁`);

        console.log(`Pontuação: ${character1.name}: ${character1.points} | ${character2.name}: ${character2.points}`);

        let block = await getRandomBlock();
        console.log(`\nBloco: ${block}\n`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.velocity;
            totalTestSkill2 = diceResult2 + character2.velocity;

            await logRollResult(
                character1.name,
                "velocidade",
                diceResult1,
                character1.velocity
            );

            await logRollResult(
                character2.name,
                "velocidade",
                diceResult2,
                character2.velocity
            );
        }

        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.maneuverability;
            totalTestSkill2 = diceResult2 + character2.maneuverability;

            await logRollResult(
                character1.name,
                "manobrabilidade",
                diceResult1,
                character1.maneuverability
            );

            await logRollResult(
                character2.name,
                "manobrabilidade",
                diceResult2,
                character2.maneuverability
            );
        }

        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.power;
            let powerResult2 = diceResult2 + character2.power;

            console.log(`${character1.name} confrontou com ${character2.name}!`);

            await logRollResult(
                character1.name,
                "poder",
                diceResult1,
                character1.power
            );

            await logRollResult(
                character2.name,
                "poder",
                diceResult2,
                character2.power
            );

            if (powerResult1 > powerResult2 && character2.points > 0) {
                character2.points--;
                console.log(`${character1.name} venceu o confronto! ${character2.name} perdeu um ponto!`);
            }

            if (powerResult2 > powerResult1 && character1.points > 0) {
                character1.points--;
                console.log(`${character2.name} venceu o confronto! ${character1.name} perdeu um ponto!`);
            }

            if (powerResult1 === powerResult2) {
                console.log("Empate no confronto!");
            }
        }

        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.name} marcou um ponto!`);
            character1.points++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.name} marcou um ponto!`);
            character2.points++;
        }

        console.log("__________________________________________________");
    }
}

async function declareWinner(character1, character2) {
    console.log("\nResultado final:\n")
    console.log(`${character1.name}: ${character1.points} ponto(s)`)
    console.log(`${character2.name}: ${character2.points} ponto(s)`)

    if (character1.points > character2.points) {
        console.log(`\n${character1.name} venceu a corrida! Parabéns!`)
    } else if (character2.points > character1.points) {
        console.log(`\n${character2.name} venceu a corrida! Parabéns!`)
    } else {
        console.log("\nA corrida terminou em empate!")
    }
}

(async function main() {
    const prompt = promptSync();

    console.log("Escolha os personagens para a corrida:\n");
    console.log("1. Mario");
    console.log("2. Peach");
    console.log("3. Yoshi");
    console.log("4. Bowser");
    console.log("5. Luigi");
    console.log("6. Donkey Kong\n");

    let choice1, choice2;

    while (true) {
        choice1 = parseInt(prompt("Escolha o primeiro personagem (1-6): "));
        choice2 = parseInt(prompt("Escolha o segundo personagem (1-6): "));

        if (!choice1 || !choice2 || choice1 < 1 || choice1 > 6 || choice2 < 1 || choice2 > 6) {
            console.log("Escolha inválida. Por favor, escolha um número entre 1 e 6.\n");
            continue;
        }

        if (choice1 === choice2) {
            console.log("Escolha personagens diferentes. Tente novamente.\n");
            continue;
        }

        break;
    }

    const player1 = await characters[choice1];
    const player2 = await characters[choice2];

    console.log(`\n🏎️🏁 Corrida entre ${player1.name} e ${player2.name} começando...`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();