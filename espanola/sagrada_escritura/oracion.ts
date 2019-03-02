import { combine } from "../quizlet/fun";

const nuestro = [
	{
		es: "Nuestro Señor",
		en: "Our Lord"
	},
	{
		es: "Nuestro Padre",
		en: "Our Father"
	},
	{
		es: "Padre Santo",
		en: "Holy Father"
	},
	{
		es: "Señor Dios",
		en: "Lord God"
	}
];

const adoración = [
	{ es: "Tú eres fiel.", en: "You are faithful." },
	{ es: "Siempre eres fiel.", en: "You are always faithful." },
	{ es: "Tú eres digno.", en: "You are worthy." },
	{ es: "Tú nombre es Santo.", en: "You name is Holy." },
	{ es: "Eres poderoso.", en: "You are powerful." },
	{ es: "Tú eres mi roca.", en: "You are my rock." },
	{ es: "Tú eres nuestro Salvador.", en: "You are our Savior." },
	{ es: "No hay otra nombre.", en: "There is no other name." },
	{ es: "Adoramos tu nombre.", en: "We adore your name." },
	{ es: "Grande es tu fidelidad.", en: "Great is your faithfulness." },
	{ es: "Te Alabamos.", en: "We praise you." },
	{ es: "Te anhelo, Señor.", en: "I long for you, Lord." },
	{ es: "Tu reino es eterno.", en: "Your kindom is eternal." },
	{ es: "No hay nadie como Tú.", en: "There is no one like you." },
	{ es: "Queremos levantar tu nombre.", en: "We lift your name." }
];

const confesión = [
	{ es: "Mi esperanza está en Jesús.", en: "My hope is in Jesus." },
	{ es: "Solo Jesús mi roca es.", en: "Only Jesus is my rock." },
	{ es: "Estamos justificados por la fe en Cristo.", en: "We are justified by our faith in Christ." },
	{ es: "Por favor, Perdoname los pecados.", en: "Please, forgive my sins." },
	{ es: "Yo sé que soy un pecador.", en: "I know that I am a sinner." },
	{ es: "Yo sé que Jesús es Rey.", en: "I know Jesus is King." },
	{ es: "Te necesito.", en: "I need you." },
	{ es: "Ayudame.", en: "Help me." },
	{ es: "Perdoname.", en: "Forgive me." }
];

const gracias = [
	{ es: "Gracias por salvarme.", en: "Thank you for saving me." },
	{ es: "Gracias por mis bendiciones.", en: "Thank you for blessing me." },
	{
		es: "Gracias por mi familia, mis amigos, y tu iglesia.",
		en: "Thank you my family, my friends, and your church."
	},
	{ es: "Gracias por amarme.", en: "Thank you for loving me." },
	{ es: "Gracias por tu amor para mi.", en: "Thank you for your love of me." }
];

const suplication = [
	{ es: "Bendiga nuestros amigos cubanos.", en: "Bless our Cuban friends." },
	{ es: "Da protección a mis amigos en Cuba.", en: "Give protection to my friends in Cuba." },
	{ es: "Guíanos cada día.", en: "Guide us each day." },
	{ es: "Danos tu sabiduría.", en: "Give us your wisdom." }
];

export = nuestro
	.concat(adoración)
	.concat(confesión)
	.concat(gracias)
	.concat(suplication)
	.concat(combine([nuestro, adoración, confesión, gracias, suplication]));
