
/**
 * Module dependencies.
 */

var jade = require('jade');

// Shortcut

var render = jade.render;

module.exports = {
    'version': function(assert){
        assert.ok(/^\d+\.\d+\.\d+$/.test(jade.version), "Invalid version format");
    },
    
    'test doctypes': function(assert){
        assert.equal('<?xml version="1.0" encoding="utf-8" ?>', render('!!! xml'));
        assert.equal('<!DOCTYPE html>', render('!!! 5'));
    },
    
    'test tags': function(assert){
        var str = [
            'p',
            'div',
            'img'
        ].join('\n');

        var html = [
            '<p></p>',
            '<div></div>',
            '<img />'
        ].join('');

        assert.equal(html, render(str), 'Test basic tags');
        assert.equal('<div class="something"></div>', render('div.something'), 'Test classes');
        assert.equal('<div id="something"></div>', render('div#something'), 'Test ids');
        assert.equal('<div class="something"></div>', render('.something'), 'Test stand-alone classes');
        assert.equal('<div id="something"></div>', render('#something'), 'Test stand-alone ids');
        assert.equal('<div id="foo" class="bar"></div>', render('#foo.bar'));
        assert.equal('<div class="bar" id="foo"></div>', render('.bar#foo'));
        assert.equal('<div id="foo" class="bar"></div>', render('div#foo(class="bar")'));
        assert.equal('<div class="bar" id="foo"></div>', render('div(class="bar")#foo'));
        assert.equal('<div id="bar" class="foo"></div>', render('div(id="bar").foo'));
        
        assert.equal('<div class="foo bar baz"></div>', render('div.foo.bar.baz', { debug: true }));
        // assert.equal('<div class="foo bar baz"></div>', render('div(class="foo").bar.baz'));
        // assert.equal('<div class="foo bar baz"></div>', render('div.foo(class="bar").baz'));
        // assert.equal('<div class="foo bar baz"></div>', render('div.foo.bar(class="baz")'));
    },
    
    'test nested tags': function(assert){
        var str = [
            'ul',
            '  li a',
            '  li b',
            '  li',
            '    ul',
            '      li c',
            '      li d',
            '  li e',
        ].join('\n');

        var html = [
            '<ul>',
            '<li>a</li>',
            '<li>b</li>',
            '<li><ul><li>c</li><li>d</li></ul></li>',
            '<li>e</li>',
            '</ul>'
        ].join('');

        assert.equal(html, render(str), 'Test nesting');
    },
    
    'test invalid indentation multiple': function(assert){
        var err;
        try {
            render('ul\n li');
        } catch (e) {
            err = e;
        }
        assert.equal('Jade(2): Invalid indentation, got 1 space, must be a multiple of two.', err.message);
        
        var err;
        try {
            render('ul\n   li');
        } catch (e) {
            err = e;
        }
        assert.equal('Jade(2): Invalid indentation, got 3 spaces, must be a multiple of two.', err.message);
    },
    
    'test invalid indents': function(assert){
        var err;
        try {
            render('ul\n\n\n    li');
        } catch (e) {
            err = e;
        }
        assert.equal('Jade(4): Invalid indentation, got 2 expected 1.', err.message);
    },
    
    'test attrs': function(assert){
        assert.equal('<img src="&lt;script&gt;" />', render('img(src="<script>")'), 'Test attr escaping');
        
        assert.equal('<input type="checkbox" checked="checked" />', render('input(type="checkbox", checked)'), 'Test boolean attrs');
        
        assert.equal('<img src="/foo.png" />', render('img(src="/foo.png")'), 'Test attr =');
        assert.equal('<img src="/foo.png" />', render('img(src  =  "/foo.png")'), 'Test attr = whitespace');
        assert.equal('<img src="/foo.png" />', render('img(src:"/foo.png")'), 'Test attr :');
        assert.equal('<img src="/foo.png" />', render('img(src  :  "/foo.png")'), 'Test attr : whitespace');
        
        assert.equal('<img src="/foo.png" alt="just some foo" />', render('img(src: "/foo.png", alt: "just some foo")'));
        assert.equal('<img src="/foo.png" alt="just some foo" />', render('img(src   : "/foo.png", alt  :  "just some foo")'));
        assert.equal('<img src="/foo.png" alt="just some foo" />', render('img(src="/foo.png", alt="just some foo")'));
        assert.equal('<img src="/foo.png" alt="just some foo" />', render('img(src = "/foo.png", alt = "just some foo")'));
    }
};