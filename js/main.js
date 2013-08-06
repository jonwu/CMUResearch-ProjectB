var pop;
var annotations = new Object();
var prevWord;
$(document).ready(function() {
	// var video = $('#ourvideo');
	// console.log(video);
	// video.on('timeupdate', function() {

	// 	$('.currentTime').text(video[0].currentTime);
	// });
});

$(document).ready(function() {
	pop = Popcorn.youtube("#youtube", "http://www.youtube.com/v/bu-Au2ga9Y0");
	$.ajax({
		url: 'David_references.xml',
		type: 'GET',
		dataType: 'xml',
		complete: function(xhr, textStatus) {
			//called when complete
		},
		success: function(data, textStatus, xhr) {
			var $xml = $(data);
			var word = $xml.find('word');
			var annotation = $xml.find('annotation');
			var previous = 0;
			var utterancePeriod = .5;
			var sentence;
			var utterances = [];

			for (var i = 0; i < annotation.length; i++) {
				var label = $(annotation[i]).attr('label');
				var name = $(annotation[i]).attr('name');
				var number = $(annotation[i]).attr('number');
				var object_parameter = $(annotation[i]).attr('object_parameter');
				var text_parameters = $(annotation[i]).attr('text_parameters');

				var words = $(annotation[i]).attr('words');
				words = words.replace('[', '')
				words = words.replace("']", '')
				words = words.replace("u'", '');
				words = words.replace("', u'", ',')
				words = words.split(',')

				for (var j = 0; j < words.length; j++) {
					annotations[words[j]] = object_parameter;
				};
				// console.log(annotations);
			};
			var offset = 38.4;
			for (var i = 0; i < word.length; i++) {
				var text = $(word[i]).attr('text');
				var s_time = $(word[i]).attr('s_time');
				var e_time = $(word[i]).attr('e_time');
				s_time = parseFloat(s_time) + offset;
				e_time = parseFloat(e_time) + offset;
				var name = $(word[i]).attr('name');
				var speaker = $(word[i]).attr('speaker');
				// if (i != 0) {
				// 	if (s_time - previous < .5) {
				// 		sentence += " " + text;
				// 	} else {
				// 		utterances.push(sentence);
				// 		sentence = text;
				// 	}
				// } else {
				// 	previous = e_time;
				// 	word = text;
				// 	sentence = text;
				// 	console.log(sentence);
				// }
				videoListener(s_time, e_time, name, text);
			};
			pop.listen("timeupdate", function() {
				$('.currentTime').text(this.currentTime());
			});
			pop.play();
			// utterances.push(sentence);
			// console.log('utter', utterances);
		},
		error: function(xhr, textStatus, errorThrown) {
			//called when there is an error
		}
	});

});

function videoListener(s_time, e_time, name, text) {
	pop.code({
		start: s_time,
		end: e_time,
		onStart: function(options) {
			$('.transcript').text(text);
			if (annotations[name]) {
				var key = annotations[name];

				if (polygonList[key]) {
					polygonList[key].setOptions({
						strokeColor: '#FFEC16',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#FFEC16',
						fillOpacity: 0.35
					});
				} else {
					console.log(key + ' is not in database');
				}

			}
		},
		onEnd: function(options) {
			$('.transcript').text('');
			if (annotations[name]) {
				var key = annotations[name];
				if (polygonList[key]) {
					polygonList[key].setOptions({
						strokeColor: '#FF0000',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#FF0000',
						fillOpacity: 0.35
					});
				} else {
					console.log(key + ' is not in database');
				}
			}
		}
	});
}