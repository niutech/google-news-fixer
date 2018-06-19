// Copyright 2018 Jerzy Głowacki

(function () {

    chrome.storage.sync.get(['maxStories', 'includedTopics'], function (config) {
        var maxStories = config.maxStories || 5;
        var includedTopics = config.includedTopics || [true, true, true, true, true, true, true, true, true, true];
        var maxStoriesEl = document.getElementById('max-stories');
        var topicsEls = document.querySelectorAll('.topics');
        var savedEl = document.getElementById('saved');

        maxStoriesEl.value = maxStories;
        topicsEls.forEach(function (el, i) {
            el.checked = includedTopics[i];
        });

        maxStoriesEl.addEventListener('change', function () {
            maxStories = +this.value;
            save();
        });
        topicsEls.forEach(function (el, i) {
            el.addEventListener('change', function () {
                includedTopics[i] = el.checked;
                save();
            });
        });

        function save() {
            chrome.storage.sync.set({maxStories: maxStories, includedTopics: includedTopics}, function () {
                savedEl.hidden = false;
                setTimeout(function () {
                    savedEl.hidden = true;
                }, 1000);
            });
        }
    });
}());