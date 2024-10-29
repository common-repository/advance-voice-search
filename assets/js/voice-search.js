/*global webkitSpeechRecognition */
(function() {
	'use strict';
	// check for support (webkit only)
	if (!('webkitSpeechRecognition' in window)) return;

	var talkMsg = 'Speak now';
	// seconds to wait for more input after last
  	var defaultPatienceThreshold = 6;

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	var allMIC

	var inputEls = document.querySelectorAll("input[name=s], input[name=search]");
	[].forEach.call(inputEls, function(inputEl) {
		var patience = parseInt(inputEl.dataset.patience, 10) || defaultPatienceThreshold;
		var micBtn, micIcon, holderIcon, newWrapper;
		var shouldCapitalize = true;

		// gather inputEl data
		var nextNode = inputEl.nextSibling;
		var parent = inputEl.parentNode;
		var inputRightBorder = parseInt(getComputedStyle(inputEl).borderRightWidth, 10);
		
		var buttonSize = 0.8 * (inputEl.dataset.buttonsize || inputEl.offsetHeight);
		// default max size for textareas
		if (!inputEl.dataset.buttonsize && inputEl.tagName === 'TEXTAREA' && buttonSize > 26) {
			buttonSize = 26;
		}

		// create wrapper if not present
		var wrapper = inputEl.parentNode;
		if (!wrapper.classList.contains('rvs-mic-wrapper')) {
			wrapper = document.createElement('div');
			wrapper.classList.add('rvs-mic-wrapper');
			wrapper.appendChild(parent.removeChild(inputEl));
			newWrapper = true;
		}

		// create mic button if not present
		micBtn = wrapper.querySelector('.rvs-mic-btn');
		if (!micBtn) {
			micBtn = document.createElement('button');
			micBtn.type = 'button';
			micBtn.classList.add('rvs-mic-btn');
			micBtn.innerHTML = '<svg width="27" height="27" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 9C10 7.4087 10.6321 5.88258 11.7574 4.75736C12.8826 3.63214 14.4087 3 16 3C17.5913 3 19.1174 3.63214 20.2426 4.75736C21.3679 5.88258 22 7.4087 22 9V17C22 18.5913 21.3679 20.1174 20.2426 21.2426C19.1174 22.3679 17.5913 23 16 23C14.4087 23 12.8826 22.3679 11.7574 21.2426C10.6321 20.1174 10 18.5913 10 17V9Z" fill="#10161F"/><path d="M10.9091 10.9091H13.4545Z" fill="#10161F"/><path d="M10.9091 10.3636H10.3636V11.4545H10.9091V10.3636ZM13.4545 11.4545C13.7558 11.4545 14 11.2103 14 10.9091C14 10.6078 13.7558 10.3636 13.4545 10.3636V11.4545ZM10.9091 11.4545H13.4545V10.3636H10.9091V11.4545Z" fill="white"/><path d="M10.9091 13.0909H13.4545Z" fill="#10161F"/><path d="M10.9091 12.5455H10.3636V13.6364H10.9091V12.5455ZM13.4545 13.6364C13.7558 13.6364 14 13.3922 14 13.0909C14 12.7897 13.7558 12.5455 13.4545 12.5455V13.6364ZM10.9091 13.6364H13.4545V12.5455H10.9091V13.6364Z" fill="white"/><path d="M10.9091 15.2727H13.4545Z" fill="#10161F"/><path d="M10.9091 14.7273H10.3636V15.8182H10.9091V14.7273ZM13.4545 15.8182C13.7558 15.8182 14 15.574 14 15.2727C14 14.9715 13.7558 14.7273 13.4545 14.7273V15.8182ZM10.9091 15.8182H13.4545V14.7273H10.9091V15.8182Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15 32V28H17V32H15ZM15 28C12.3478 28 9.8043 26.9464 7.92893 25.0711C6.05357 23.1957 5 20.6522 5 18H7C7 20.1217 7.84285 22.1566 9.34315 23.6569C10.8434 25.1571 12.8783 26 15 26H17C19.1217 26 21.1566 25.1571 22.6569 23.6569C24.1571 22.1566 25 20.1217 25 18H27C27 19.3132 26.7413 20.6136 26.2388 21.8268C25.7362 23.0401 24.9997 24.1425 24.0711 25.0711C23.1425 25.9997 22.0401 26.7362 20.8268 27.2388C19.6136 27.7413 18.3132 28 17 28H15Z" fill="#10161F"/><path class="hide_mic" d="M24.7727 12.7273L24.7727 10.1818Z" fill="#10161F"/><path class="hide_mic" d="M24.7727 12.7273L24.7727 10.1818" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M8.77271 12.7273L8.77271 10.1818Z" fill="#10161F"/><path class="hide_mic" d="M8.77271 12.7273L8.77271 10.1818" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M26.9545 13.8182L26.9545 9.45454Z" fill="#10161F"/><path class="hide_mic" d="M26.9545 13.8182L26.9545 9.45454" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M6.59082 13.8182L6.59082 9.45454Z" fill="#10161F"/><path class="hide_mic" d="M6.59082 13.8182L6.59082 9.45454" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M29.1364 15.2727L29.1364 7.99999Z" fill="#10161F"/><path class="hide_mic" d="M29.1364 15.2727L29.1364 7.99999" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M4.40906 15.2727L4.40906 7.99999Z" fill="#10161F"/><path class="hide_mic" d="M4.40906 15.2727L4.40906 7.99999" stroke="#10161F" stroke-width="1.09091" stroke-linecap="round"/><path class="hide_mic" d="M11.6818 13.0909H14.2272Z" fill="#10161F"/></svg>';
			// micIcon = document.createElement('span');
			// holderIcon = document.createElement('span');
			// micIcon.classList.add('si-mic');
			// holderIcon.classList.add('si-holder');
			// micBtn.appendChild(micIcon);
			// micBtn.appendChild(holderIcon);
			wrapper.appendChild(micBtn);

			// size and position mic and input
			wrapper.style.display = 'flex';

			micBtn.style.cursor = 'pointer';
			// micBtn.style.paddingTop = 0.125 * buttonSize + 'px';
			if(buttonSize){
				var micBtnSVG = wrapper.querySelector('.rvs-mic-btn svg');
				micBtnSVG.style.height = micBtnSVG.style.width = buttonSize + 'px';
				// console.log(micBtnSVG);
				
				// micBtnSVG.style.width = buttonSize + 'px';
			}
			// mic_active.style.display = 'block';
			// inputEl.style.paddingRight = buttonSize - inputRightBorder + 'px';

		}
		// append wrapper where input was
		if (newWrapper) parent.insertBefore(wrapper, nextNode);

		if(('webkitSpeechRecognition' in window)){
			// setup recognition
			var prefix = '';
			var isSentence;
			var recognizing = false;
			var timeout;
			var oldPlaceholder = null;
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;

			// if lang attribute is set on field use that
			// (defaults to use the lang of the root element)
			if (inputEl.lang) recognition.lang = inputEl.lang;

			function restartTimer() {
				timeout = setTimeout(function() {
					recognition.stop();
				}, patience * 1000);
			}

			recognition.onstart = function() {
				oldPlaceholder = inputEl.placeholder;
				inputEl.placeholder = inputEl.dataset.ready || talkMsg;
				recognizing = true;
				micBtn.classList.add('listening');
				restartTimer();
			};

			recognition.onend = function() {
				recognizing = false;
				allMIC.forEach(function(element) {
					element.style.display = 'none';
				});
				clearTimeout(timeout);
				micBtn.classList.remove('listening');
				
				if (oldPlaceholder !== null) inputEl.placeholder = oldPlaceholder;

				// If the <input> has data-instant-submit and a value,
				if (inputEl.dataset.instantSubmit !== undefined && inputEl.value) {
					// submit the form it's in (if it is in one).
					if (inputEl.form) inputEl.form.submit();
				}
			};

			recognition.onresult = function(event) {
				clearTimeout(timeout);

				// get SpeechRecognitionResultList object
				var resultList = event.results;

				// go through each SpeechRecognitionResult object in the list
				var finalTranscript = '';
				var interimTranscript = '';
				for (var i = event.resultIndex; i < resultList.length; ++i) {
					var result = resultList[i];
 
					// get this result's first SpeechRecognitionAlternative object
					var firstAlternative = result[0];

					if (result.isFinal) {
						finalTranscript = firstAlternative.transcript;
					} else {
						interimTranscript += firstAlternative.transcript;
					}
				}
				// capitalize transcript if start of new sentence
				var transcript = finalTranscript || interimTranscript;
				transcript = !prefix || isSentence ? capitalize(transcript) : transcript;

				// append transcript to cached input value
				inputEl.value = prefix + transcript;

				// set cursur and scroll to end
				inputEl.focus();
				if (inputEl.tagName === 'INPUT') {
					inputEl.scrollLeft = inputEl.scrollWidth;
				} else {
					inputEl.scrollTop = inputEl.scrollHeight;
				}

				restartTimer();
			};
		}

		micBtn.addEventListener('click', function(event) {
			allMIC = document.querySelectorAll('.rvs-mic-btn .hide_mic');
			allMIC.forEach(function(element) {
				element.style.display = 'none';
			});

			event.preventDefault();

			// stop and exit if already going
			// console.log(recognizing);
			let hideMicElements = micBtn.querySelectorAll('.rvs-mic-btn .hide_mic');
			if (recognizing) {
				recognition.stop();
				hideMicElements.forEach(function(element) {
					element.style.display = 'none';
				});
				return;
			}else{
				hideMicElements.forEach(function(element) {
					element.style.display = 'block';
				});
			}

			// Cache current input value which the new transcript will be appended to
			var endsWithWhitespace = inputEl.value.slice(-1).match(/\s/);
			prefix = !inputEl.value || endsWithWhitespace ? inputEl.value : inputEl.value + ' ';

			// check if value ends with a sentence
			isSentence = prefix.trim().slice(-1).match(/[\.\?\!]/);

			// restart recognition
			recognition.start();
		}, false);
	});
})();