var product = '/catalogo/produto/';

// função geral para buscar os dados
function getData(handleData) {
	$.ajax({
		url:"/dados",  
		success:function(data) {
			handleData(data); 
		}
	});
}


/*************** STYLE ***************/

// funções de style ao carregar a página
function styles(){
	$("body").fadeIn(500);
	onScroll();
	carousel();
}
// Muda caracteristicas conforme a scrollbar
function onScroll(){
	var scrollY = 0;
	var pageScroll = window.pageYOffset;
	if(scrollY < pageScroll) {
		$('.navig').addClass('navig-top');
		$('.navbar-content').css({top: '15%'});
		$('#pg-title').fadeOut(200);
		$('#logoNav').fadeIn(200);
	}
	else if(pageScroll == scrollY){
		$('.navig').removeClass('navig-top');
		$('.navbar-content').css({top: '10%'});
		$('#pg-title').fadeIn(500);
		$('#logoNav').fadeOut(100);
	}
}
// caracteristicas do carrossel
function carousel(){
	var clickEvent = false;
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav').children().length-1;
			var current = $('.nav li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.nav li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
}

/*************** SEARCH ***************/

// Abre a tela de pesquisa
function openSearch(){
	$(".search-modal").animate({width: '100%'});
	$('body, html').css({'overflow-y':'hidden'});
	$('.search-input').focus();
}
// Fecha a tela de pesquisa
function closeSearch(){
	$(".search-modal").animate({width: '0%'});
	$('.search-input').val(''); 
	$('body, html').css({'overflow-y':'auto'});
	$('.list-result, #box-result').html('');
}
// faz a busca dos dados
function searchJson(){
	var api='https://www.googleapis.com/books/v1/volumes?q=intitle:';
	var key = '&key=AIzaSyDpnzpHdRNWkiZfmLpkNTpuWBnZoKGJ-F4';
	var quantidade = '&maxResults=20&lang=pt'
	$('#search-input').keyup(function(){//quando escrever na input, realiza a busca
		var searchField = $(this).val();
		if(searchField === '')  {//se não houver nada no campo de busca, limpa a div de resultados
			$(".list-result, #box-result").html('');
			return;
		}

		var results = '<table class="table"><thead><tr><th>Produto</th><th>Título</th><th>Autor</th><th>Preço(R$)</th></tr></thead><tbody>';
		var regex = new RegExp(searchField, "i");//define a busca sem case sensitive

		$.get(api+searchField+quantidade+key, function(data){//procura dados na api que tenham no titulo as palavras digitadas
			console.log(data)

			for(i in data.items){

				var valor=data.items[i].saleInfo.listPrice;
				var img = data.items[i].volumeInfo.imageLinks;

				if(img==undefined){
					break;
				}
				if(valor==undefined){
					valor="Produto Esgotado"
				}else{
					valor="R$ "+data.items[i].saleInfo.listPrice.amount.toFixed(2).toString().replace('.',',');
				}

				var titulo = data.items[i].volumeInfo.title;
				//mostra a div de resultados e printa 
				results+='<tr id="livros">'
				+'<td class="cod"><a href="http://localhost:3000/catalogo/produto/'+data.items[i].id+'"><img src="'+data.items[i].volumeInfo.imageLinks.thumbnail
				+'" height="150px"></a></td>'
				+'<td class="colored">'+data.items[i].volumeInfo.title+'</td>'
				+'<td class="autor">'+data.items[i].volumeInfo.authors[0]+'</td>'
				+'<td class="colored">'+valor+'</td>'
				+'</tr>';

			}
			results+='</tbody></table>';
			searchResult(results);
		});
	});
}

// define a lista dos resultados
function searchResult(results){
	$('.list-result').html(results);//define a div com os resultados
	if($(".list-result td").length==0){
		$(".list-result").html("<h2>Nenhum resultado encontrado.</h2>");
		$("#box-result").html("");
	}		
}

// actions style
function actionStyle(){
	window.onscroll = function() {
		onScroll();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
}
// ações dos botoes/inputs
function actions(){
	actionStyle();
	$(".selectpicker").change(function(){
		catalogo($(this).val());
	});
	$(".preview").click(function(){
		initialize();
	})
}

function catalogo(editora){
	
	$("#catalogo").html("");
	if(editora=="all"){
		$(".selectpicker > option").each(function(){
			editora = $(this).val();
			if(editora!="all"){
				createCatalogo(editora);
			}
			
		});
	}else{
		createCatalogo(editora);
	}

}

function createCatalogo(editora){
	var api='https://www.googleapis.com/books/v1/volumes?q=inpublisher:';
	var key = '&key=AIzaSyDpnzpHdRNWkiZfmLpkNTpuWBnZoKGJ-F4';
	var quantidade = '&maxResults=20';
	$.get(api+editora+quantidade+key, function(data){
		for(i in data.items){
			var valor=data.items[i].saleInfo.listPrice;
			var img = data.items[i].volumeInfo.imageLinks;
			if(img==undefined){
				break;
			}
			if(valor==undefined){
				valor="Produto Esgotado"
			}else{
				valor="R$ "+data.items[i].saleInfo.listPrice.amount.toFixed(2).toString().replace('.',',');
			}
			$("#catalogo").append('<div class="grid col-md-4 col-lg-4 col-sm-6 isbn"><a href="catalogo/produto/'+data.items[i].id+'"><figure class="effect-terry"><img src="'
				+data.items[i].volumeInfo.imageLinks.thumbnail+'"><div class="infoCatalogo"><h2 class="tagsNome col-md-7">'
				+data.items[i].volumeInfo.title+'<br><span>'+data.items[i].volumeInfo.authors[0]
				+'</span></h2><h2 class="tagsPreco col-md-5">'+valor+
				'</div></figure></a></div>');
		}
	});
}

function initialize() {
	var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
	var isbn = $("#viewerCanvas").attr("data-isbn");
	viewer.load('ISBN:'+isbn);
}


$(document).ready(function(){
	google.books.load();
	actions();
	catalogo($('.selectpicker').val());
	styles(); 
	searchJson();
});
