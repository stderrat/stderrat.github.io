/*!
 * highlightjs-terraform 1.0.6 - Terraform / HCL for highlight.js
 * Source: https://github.com/highlightjs/highlightjs-terraform (commit eb1b966)
 * Registers the language "terraform" with the aliases "tf" and "hcl".
 *
 * MIT License
 *
 * Copyright (c) 2020 highlightjs-terraform
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// YAUB: the language definition below is copied unchanged from terraform.js.
// The upstream file declares a global `var module` as a browser shim, which would make later
// UMD scripts (Mermaid, D3) export into that object instead of window. This wrapper keeps the
// definition in its own scope and registers it with the global hljs instead.
(function () {
  'use strict';

  function hljsDefineTerraform(hljs) {
  	var NUMBERS = {
  		className: 'number',
  		begin: '\\b\\d+(\\.\\d+)?',
  		relevance: 0
  	};
  	var STRINGS = {
  		className: 'string',
  		begin: '"',
  		end: '"',
  		contains: [{
  			className: 'variable',
  			begin: '\\${',
  			end: '\\}',
  			relevance: 9,
  			contains: [{
  				className: 'string',
  				begin: '"',
  				end: '"'
  			}, {
  			className: 'meta',
  			begin: '[A-Za-z_0-9]*' + '\\(',
  			end: '\\)',
  			contains: [
  				NUMBERS, {
  					className: 'string',
  					begin: '"',
  					end: '"',
  					contains: [{
  						className: 'variable',
  						begin: '\\${',
  						end: '\\}',
  						contains: [{
  							className: 'string',
  							begin: '"',
  							end: '"',
  							contains: [{
  								className: 'variable',
  								begin: '\\${',
  								end: '\\}'
  							}]
  						}, {
  							className: 'meta',
  							begin: '[A-Za-z_0-9]*' + '\\(',
  							end: '\\)'
  						}]
  					}]
            		},
            	'self']
  			}]
  		}]
  	};

  return {
  	aliases: ['tf', 'hcl'],
  	keywords: 'resource variable provider output locals module data terraform|10',
  	literal: 'false true null',
  	contains: [
     		hljs.COMMENT('\\#', '$'),
     		NUMBERS,
  		STRINGS
  	]
  }
  }

  if (window.hljs) {
    window.hljs.registerLanguage('terraform', hljsDefineTerraform);
  }
})();
