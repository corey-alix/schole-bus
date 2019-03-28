const dialog = [
	{ es: "Hola, como está usted?", en: "Hello, how are you?" },
	{ es: "Hola, cómo estás?", en: "Hello, how are you?" },
	{ es: "Como está ella?", en: "How is she?" },
	{ es: "Hola, buenos días.", en: "Hello, good morning." },
	{ es: "Buenas tardes.", en: "Good afternoon." },
	{ es: "Buenas noches", en: "Good night." },
	{ es: "Estoy bien. Gracias.", en: "I'm fine. Thank you." },
	{ es: "Y usted?", en: "And you?" },
	{ es: "Estoy bien también.", en: "I am fine too." },
	{ es: "De nada.", en: "You're welcome." },
	{ es: "Ella está bien.", en: "She is fine." },
	{ es: "él está bien.", en: "He is fine." },
	{ es: "Estoy cansado.", en: "I am tired." },
	{ es: "Ella está cansada.", en: "She is tired." },
	{ es: "El está cansado", en: "He is tired." },
	{ es: "Usted está cansado.", en: "You are tired." },
	{ es: "Tú hablas español?", en: "Do you speak spanish?" },
	{ es: "Si, yo hablo español.", en: "Yes, I speak spanish." },
	{ es: "Por favor, no.", en: "Please, no." },
	{ es: "Si, Gracias.", en: "Yes, please." },
	{ es: "Disculpe", en: "Excuse me." },
	{ es: "Mucho gusto.", en: "Nice to meet you." },
	{ es: "El baño está aqui.", en: "The bathroom is here." },
	{ es: "Una calle.", en: "A street." },
	{ es: "Una mesa para dos, por favor.", en: "A table for two, please." },
	{ es: "Yo tengo un hermano.", en: "I have a brother" },
	{ es: "Mi familia es interesante", en: "My family is interesting." },
	{ es: "Yo vivo aqui", en: "I live here" },
	{ es: "Mi esposa es inteligente", en: "My wife is intelligent." },
	{ es: "Tú tienes un gato?", en: "Do you have a cat?" },
	{ es: "Es esta tu casa y tu perro?", en: "Is that your house and your dog?" },
	{ es: "Mi perro es grande y muy bonito", en: "By dog is big and very pretty" },
	{ es: "Mi hermano y mi hermana son interesante.", en: "My brother and my sister are interesting." },
	{ es: "Ella tiene un gato", en: "She has a cat" },
	{ es: "Un esposo y una esposa", en: "a husband and a wife" },
	{ es: "Yo tengo un hermano y una hermana.", en: "I have a brother and a sister." },
	{ es: "Yo necesito la cuenta.", en: "I need the check." },
	{ es: "el sándwich", en: "the sandwich" },
	{ es: "la carne", en: "the meat" },
	{ es: "un café sin azúcar", en: "a coffee without sugar" },
	{ es: "un jugo de naranja, por favor", en: "one orange juice please" },
	{ es: "yo quiero pagar la cuenta.", en: "I want to pay the check." },
	{ es: "sin azucar, por favor", en: "without sugar, please" },
	{ es: "un vaso de agua, por favor.", en: "a glass of water, please" },
	{ es: "una hamburguesa de pescado.", en: "A fish burger." },
	{ es: "sin sal, por favor", en: "without salt, please" },
	{ es: "una ensalada, por favor", en: "a salad, please" },
	{ es: "un sándwich de pescado", en: "a fish sandwich" },
	{ es: "una taza y un vaso", en: "a cup and a glass" },
	{ es: "con o sin azúcar", en: "with or without sugar?" },
	{ es: "yo quiero comprar una camisa", en: "I want to buy a shirt" },
	{ es: "una camiseta es una camisa", en: "A t-shirt is a shirt" },
	{ es: "Si, este sombrero", en: "Yes, this hat" },
	{ es: "No, ese sombrero.", en: "No, that hat." },
	{ es: "Un sombrero barato", en: "A cheap hat" },
	{ es: "el cinturon", en: "the belt" },
	{ es: "un regalo para mi esposa.", en: "A gift for my wife." },
	{ es: "el reloj", en: "the watch" },
	{ es: "Demasiado gris.", en: "Too gray" },
	{ es: "Mi tienda favorita.", en: "My favorite store." },
	{ es: "Una pregunta interesante", en: "An interesting question." },
	{ es: "Yo leo con mi maestro", en: "I read with my teacher" },
	{ es: "Yo no soy estudiante", en: "I am not a student" },
	{ es: "Yo soy de España", en: "I am from Spain" },
	{ es: "Lo siento, estoy mal", en: "I am sorry, I'm not well" },
	{ es: "Tú usas el carro?", en: "Do you use the car?" },
	{ es: "Señor, ¿estás usando el teléfono?", en: "Sir, are you using the telephone?" },
	{ es: "Yo necesito mi boleto.", en: "I need my ticket." },
	{ es: "Ella tiene una maleta.", en: "She has a suitcase." },
	{ es: "Usted tiene una bolsa?", en: "Do you have a bag?" },
	{ es: "Quién habla español?", en: "Who speaks spanish?" },
	{ es: "Quién come una ensalada?", en: "Who is eating a salad?" },
	{ es: "La mujer vive en Inglaterra.", en: "The woman lives in England." },
	{ es: "Ella es una mujer joven.", en: "She is a young woman." },
	{ es: "Tú tienes mi dirección?", en: "Do you have my address?" },
	{ es: "Señor, yo tengo una pregunta.", en: "Sir, I have a question." },
	{ es: "La mujer italiana es mi madre.", en: "The italian woman is my mother." },
	{ es: "Vives en una ciudad pequeña?", en: "Do you live in a small city?" }
];

export = dialog.map(q => ({ a: q.es, q: q.en }));
