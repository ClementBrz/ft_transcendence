export function sendGameDataToDjango(winner, scoreLeft, scoreRight) {
	const url = 'http://127.0.0.1:8000/api/add/'; //CHECK: pas sure du /add!!
	const data = 
	{
		/*TODO: MARINE
		Lorsque les joueurs se connecteront, leurs noms apparaitront a droite
		et gauche du jeu (pour savoir qui joue de quel cote).
		Insere ici le nom des variables correspondant aux nicknames envoyes par jess
		pour que je puisse recuperer ces infos dans ma base de donnees de django stp.
		*/
		userLeft: userLeft,//TODO: inserer ici
		userRight: userRight,//TODO: inserer ici
		scoreLeft: scoreLeft,
		scoreRight: scoreRight
	};

	fetch(url, 
		{
		method: 'POST',
		headers: 
			{
				'Content-Type': 'application/json',
			},
		body: JSON.stringify(data),
	})
	.then(response => response.json())
	.then(data => {console.log('Success:', data);})
	.catch((error) => {console.error('Error:', error);});
}