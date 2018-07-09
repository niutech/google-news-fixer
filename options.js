// Copyright 2018 Jerzy Głowacki

(function () {

    chrome.storage.sync.get(['maxStories', 'includedTopics'], function (config) {
        var maxStories = config.maxStories || 5;
        var includedTopics = Object.prototype.toString.call(config.includedTopics) === '[object Object]' && config.includedTopics || {};
        var maxStoriesEl = document.getElementById('max-stories');
        var topicsEl = document.getElementById('topics');
        var savedEl = document.getElementById('saved');
        var topicsHTML = '';

        maxStoriesEl.value = maxStories;
        Object.keys(includedTopics).forEach(function (key) {
            topicsHTML += '<label><input type="checkbox" data-topic="' + key + '"' + (includedTopics[key] ? ' checked' : '') + '> ' + key + '</label><br>';
        });
        if (topicsHTML) {
            topicsEl.innerHTML = topicsHTML;
        }

        maxStoriesEl.addEventListener('change', function () {
            maxStories = +this.value;
            save();
        });
        topicsEl.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
            el.addEventListener('change', function () {
                includedTopics[el.dataset.topic] = el.checked;
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