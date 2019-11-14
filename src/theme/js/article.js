import $ from 'jquery'
import config from '../../../vertical.json'

export const InitHljs = () => {
    const $codes = $('pre code')
    if ($codes.length === 0) {
        return false
    }

    var parseHljs = function () {
        $codes.each(function (i, block) {
            var $it = $(this)
            if ($it.hasClass('language-flow')) {
                return
            }

            if ($it.parent().find('.pipe-code__copy').length > 0) {
                return
            }

            $it.css({'max-height': $(window).height() - 40}).
            parent().
            prepend(`<textarea>${$it.text()}</textarea><div 
          aria-label="copy" onmouseover="this.setAttribute('aria-label', 'Copy')" 
          class="pipe-code__copy pipe-tooltipped pipe-tooltipped--w" 
          onclick="this.previousElementSibling.select();document.execCommand('copy');this.setAttribute('aria-label','Copied')"><svg><use xlink:href="#copy"></use></svg></div>`)

            hljs.highlightBlock(block)
        })
    }

    if (typeof hljs === 'undefined') {
        $.ajax({
            method: 'GET',
            url: (config.StaticServer || config.Server) +
                '/highlight.js/9.13.1/highlight.min.js',
            dataType: 'script',
            cache: true,
        }).done(function () {
            parseHljs()
        })
    } else {
        parseHljs()
    }
}
