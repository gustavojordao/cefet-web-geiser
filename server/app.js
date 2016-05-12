var fs = require('fs');

var _ = require('underscore');

var express = require('express'),
    app = express();

var server = app.listen(3000,
	function(){
		var host = server.address().address;
		var port = server.address().port;
		console.log('Server started: http://%s:%s', host, port);
	}
);

app.use(express.static('client'));

/*app.get('server', 
	function(request, response){
		response.render('index.js');
	}
);*/

app.set('view engine', 'hbs');

app.set('views', 'server/views');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
};

fs.readFile('server/data/jogadores.json',
	function(err, data){				
		db[0] = JSON.parse(data);
	}
);

fs.readFile('server/data/jogosPorJogador.json',
	function(err, data){				
		db[1] = JSON.parse(data);
	}
);

app.get('/', 
	function(request, response){
		response.render('index.hbs', db[0]);
	}
);

app.get('/jogador/:numero_identificador', 
	function(request, response){
		var id = request.params.numero_identificador;

		var jogosJogador = db[1][id];
		
		var i=0;		

		var jogadores = db[0].players;

		var jogador;

		var naoJogados = 0;
		var favorito;
		var maisJogados;

		for(i=0; i<jogadores.length; i++){
			if(jogadores[i].steamid == id){
				jogador = jogadores[i];
			}
		}

			

		for(i=0; i<jogosJogador.games.length; i++){
			jogosJogador.games[i].playtime_forever_h = (jogosJogador.games[i].playtime_forever/60).toFixed();
			if(jogosJogador.games[i].playtime_forever == 0){
				naoJogados++;
			}

			if(!favorito){
				favorito = i;
			}
			else if(jogosJogador.games[i].playtime_forever > jogosJogador.games[favorito].playtime_forever){
				favorito = i;
			}
			
		}

		jogosJogador.never_played = naoJogados;
		jogosJogador.favorite = jogosJogador.games[favorito];

		maisJogados = _.first(_.sortBy(jogosJogador.games,
			function(e){
				return -e.playtime_forever;
			}
		), 5);
		jogosJogador.top_5 = maisJogados;

		var dados =
		{
			"jogador": jogador,
			"jogos": jogosJogador		
		};	

		response.render('jogador.hbs', dados);
	}
);

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');



// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
