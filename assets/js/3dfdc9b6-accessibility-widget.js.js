(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.accessibilityWidget = {
    attach: function (context, settings) {
      once('accessibility-buttons', 'body', context).forEach(() => {
        const originalStyles = new Map();

        // --- Functions ---
        function toggleMenu() {
          const menu = document.getElementById('nbMenu');
          menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }

        const menu_btn = document.querySelectorAll('.nb-menu-btn');
        menu_btn.forEach((ac_btn) => {
          // Attach the toggleMenu function to each button
          ac_btn.addEventListener('click', toggleMenu);
        });

        function adjustFontSize(change) {
          let scale = parseFloat(localStorage.getItem('fontScale') || '1');
          scale += change;
          scale = Math.max(0.5, Math.min(2, scale));
          localStorage.setItem('fontScale', scale);

          document
            .querySelectorAll(
              'body *:not(.nb-menu):not(.nb-menu *):not(.material-icons)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  fontSize: getComputedStyle(el).fontSize,
                });
              }
              const originalSize = parseFloat(originalStyles.get(el).fontSize);
              el.style.fontSize = `${originalSize * scale}px`;
            });

          // Highlight the button
          const button =
            change > 0
              ? document.querySelector('.nb-btn.font-increase')
              : document.querySelector('.nb-btn.font-decrease');

          if (button) {
            button.classList.add('active');
          }
        }

        function adjustLineHeight(change) {
          let height = parseFloat(localStorage.getItem('lineHeight') || '1');
          height += change;
          height = Math.max(1, Math.min(2.5, height));
          localStorage.setItem('lineHeight', height);

          document
            .querySelectorAll('body *:not(.nb-menu):not(.nb-menu *)')
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  lineHeight: getComputedStyle(el).lineHeight,
                });
              }
              el.style.lineHeight = height;
            });

          // Highlight the button
          const button = document.querySelector('.line-height-increase');
          if (button) {
            button.classList.add('active');
          }
        }

        function adjustLetterSpacing(change) {
          let spacing = parseFloat(
            localStorage.getItem('letterSpacing') || '0',
          );
          spacing += change;
          spacing = Math.max(0, Math.min(0.5, spacing));
          localStorage.setItem('letterSpacing', spacing);

          document
            .querySelectorAll(
              'body *:not(.nb-menu):not(.nb-menu *):not(.material-icons)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  letterSpacing: getComputedStyle(el).letterSpacing,
                });
              }
              el.style.letterSpacing = `${spacing}em`;
            });

          // Highlight the button
          const button = document.querySelector('.letter-spacing-increase');
          if (button) {
            button.classList.add('active');
          }
        }

        function enableDyslexicFont() {
          const isEnabled = localStorage.getItem('dyslexicFont') === 'true';
          localStorage.setItem('dyslexicFont', !isEnabled);

          document
            .querySelectorAll(
              'body *:not(.nb-menu):not(.nb-menu *):not(.material-icons)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  fontFamily: getComputedStyle(el).fontFamily,
                });
              }
              el.style.fontFamily = !isEnabled
                ? 'OpenDyslexic3'
                : originalStyles.get(el).fontFamily;
            });

          // Highlight the button
          const button = document.querySelector('.dyslexic-font');
          if (button) {
            if (!isEnabled) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function enableHighlightHeadings() {
          const isEnabled =
            localStorage.getItem('highlightHeadings') === 'true';
          localStorage.setItem('highlightHeadings', !isEnabled);

          document
            .querySelectorAll(
              'h1:not(.nb-menu *), h2:not(.nb-menu *), h3:not(.nb-menu *)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  color: getComputedStyle(el).color,
                  textDecoration: getComputedStyle(el).textDecoration,
                });
              }
              if (!isEnabled) {
                el.style.color = '#ff0000';
              } else {
                el.style.color = originalStyles.get(el).color;
                el.style.textDecoration = originalStyles.get(el).textDecoration;
              }
            });

          // Highlight the button
          const button = document.querySelector('.highlight-headings');
          if (button) {
            if (!isEnabled) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function enableHighlightLinks() {
          const isEnabled = localStorage.getItem('highlightLinks') === 'true';
          localStorage.setItem('highlightLinks', !isEnabled);

          document
            .querySelectorAll(
              'a:not(.nb-menu *), button:not(.nb-btn):not(.nb-reset-btn):not(.nb-menu *)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  color: getComputedStyle(el).color,
                  textDecoration: getComputedStyle(el).textDecoration,
                });
              }
              if (!isEnabled) {
                el.style.color = '#FDB931';
                el.style.textDecoration = 'underline';
              } else {
                el.style.color = originalStyles.get(el).color;
                el.style.textDecoration = originalStyles.get(el).textDecoration;
              }
            });

          // Highlight the button
          const button = document.querySelector('.highlight-links');
          if (button) {
            if (!isEnabled) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function adjustFontWeight() {
          const isEnabled =
            localStorage.getItem('fontWeightEnabled') === 'true';
          let weight = parseInt(localStorage.getItem('fontWeight') || '400');

          if (isEnabled) {
            // Reset to default (400) if already enabled
            weight = 400;
            localStorage.setItem('fontWeightEnabled', 'false');
          } else {
            // Increase weight by 200 if not enabled
            weight += 200;
            weight = Math.max(100, Math.min(900, weight));
            localStorage.setItem('fontWeightEnabled', 'true');
          }
          localStorage.setItem('fontWeight', weight);

          document
            .querySelectorAll(
              'body *:not(.nb-menu):not(.nb-menu *):not(.material-icons)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  fontWeight: getComputedStyle(el).fontWeight,
                });
              }
              el.style.fontWeight = weight;
            });

          // Highlight the button
          const button = document.querySelector('.font-weight-toggle');
          if (button) {
            if (!isEnabled) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function enableBigCursor() {
          const cursorSizes = ['default', 'large', 'x-large', 'xx-large'];
          let currentSize = localStorage.getItem('cursorSize') || 'default';
          let index = cursorSizes.indexOf(currentSize);
          currentSize = cursorSizes[(index + 1) % cursorSizes.length];
          localStorage.setItem('cursorSize', currentSize);

          switch (currentSize) {
            case 'default':
              document.body.style.cursor = 'default';
              break;
            case 'large':
              document.body.style.cursor =
                'url("../images/7e2cb1d7-1828166.png.png"), auto';
              break;
            case 'x-large':
              document.body.style.cursor =
                'url("../images/8eacbe2b-1828166.png.png"), auto';
              break;
            case 'xx-large':
              document.body.style.cursor =
                'url("../images/a1a9c786-1828166.png.png"), auto';
              break;
          }

          const cursorButton = document.querySelector(
            '.cursor-toggle .nb-translate',
          );
          if (cursorButton) {
            cursorButton.textContent = `Bigger Cursor: ${
              currentSize === 'default'
                ? 'Default'
                : currentSize.replace('x-', 'X-').toUpperCase()
            }`;
          }

          // Highlight the button
          const button = document.querySelector('.cursor-toggle');
          if (button) {
            if (currentSize !== 'default') {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function adjustContrast() {
          const contrastModes = ['off', 'light', 'dark'];
          let currentMode = localStorage.getItem('contrastMode') || 'off';
          let index = contrastModes.indexOf(currentMode);
          currentMode = contrastModes[(index + 1) % contrastModes.length];
          localStorage.setItem('contrastMode', currentMode);

          if (!originalStyles.has(document.documentElement)) {
            originalStyles.set(document.documentElement, {
              backgroundColor: getComputedStyle(document.documentElement)
                .backgroundColor,
              color: getComputedStyle(document.documentElement).color,
            });
          }

          switch (currentMode) {
            case 'off':
              document.documentElement.style.backgroundColor =
                originalStyles.get(document.documentElement).backgroundColor;
              document.documentElement.style.color = originalStyles.get(
                document.documentElement,
              ).color;
              document.documentElement.style.filter = '';
              break;
            case 'light':
              document.documentElement.style.backgroundColor = '#fff';
              document.documentElement.style.color = '#000';
              document.documentElement.style.filter = 'contrast(1.2)';
              break;
            case 'dark':
              document.documentElement.style.backgroundColor = '#000';
              document.documentElement.style.color = '#fff';
              document.documentElement.style.filter = 'contrast(1.2)';
              break;
          }

          const widget = document.querySelector('.nb-menu');
          if (widget) {
            widget.style.backgroundColor = '#f9f9f9';
            widget.style.color = '#000';
            widget.style.filter = '';
            document.querySelectorAll('.nb-menu *').forEach((el) => {
              el.style.color = '';
              el.style.backgroundColor = '';
              el.style.filter = '';
            });
          }

          const contrastButton = document.querySelector(
            '.contrast-toggle .nb-translate',
          );
          if (contrastButton) {
            contrastButton.textContent = `Contrast: ${
              currentMode.charAt(0).toUpperCase() + currentMode.slice(1)
            }`;
          }

          // Highlight the button
          const button = document.querySelector('.contrast-toggle');
          if (button) {
            if (currentMode !== 'off') {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function adjustTextAlign() {
          const alignments = ['left', 'right', 'center'];
          let current = localStorage.getItem('textAlign') || 'left';
          let index = alignments.indexOf(current);
          current = alignments[(index + 1) % alignments.length];
          localStorage.setItem('textAlign', current);

          document
            .querySelectorAll(
              'h1:not(.nb-menu *), h2:not(.nb-menu *), h3:not(.nb-menu *), h4:not(.nb-menu *), h5:not(.nb-menu *), h6:not(.nb-menu *), p:not(.nb-menu *), li:not(.nb-menu *), a:not(.nb-menu *), span:not(.material-icons):not(.nb-menu *), div:not(.nb-menu):not(.nb-menu *)',
            )
            .forEach((el) => {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  textAlign: getComputedStyle(el).textAlign,
                });
              }
              el.style.textAlign = current;
            });

          const alignButton = document.querySelector(
            '.text-align-toggle .material-icons',
          );
          if (alignButton) {
            alignButton.textContent = `format_align_${current}`;
          }

          // Highlight the button
          const button = document.querySelector('.text-align-toggle');
          if (button) {
            if (current !== 'left') {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          }
        }

        function showPageStructure() {
          const isEnabled = localStorage.getItem('pageStructure') === 'true';
          localStorage.setItem('pageStructure', !isEnabled);

          const pageStructureDiv = document.getElementById('pageStructure');
          const headingsList = document.getElementById('headingsList');
          const linksList = document.getElementById('linksList');

          if (!isEnabled) {
            // Show the page structure
            pageStructureDiv.style.display = 'block';

            // Clear previous content
            headingsList.innerHTML = '';
            linksList.innerHTML = '';

            // Fetch and display headings in a table
            const headings = document.querySelectorAll(
              'h1:not(.nb-menu *), h2:not(.nb-menu *), h3:not(.nb-menu *), h4:not(.nb-menu *), h5:not(.nb-menu *), h6:not(.nb-menu *)',
            );
            headings.forEach((heading) => {
              const tr = document.createElement('tr');
              const levelTd = document.createElement('td');
              const textTd = document.createElement('td');
              levelTd.textContent = heading.tagName;
              textTd.textContent = heading.textContent;
              tr.appendChild(levelTd);
              tr.appendChild(textTd);
              headingsList.appendChild(tr);
            });

            // Fetch and display links in a table
            const links = document.querySelectorAll('a:not(.nb-menu *)');
            links.forEach((link) => {
              const tr = document.createElement('tr');
              const textTd = document.createElement('td');
              const urlTd = document.createElement('td');
              const a = document.createElement('a');
              a.href = link.href;
              a.textContent = link.textContent || link.href;
              a.target = '_blank';
              textTd.appendChild(a);
              urlTd.textContent = link.href;
              tr.appendChild(textTd);
              tr.appendChild(urlTd);
              linksList.appendChild(tr);
            });

            // Update button text and highlight
            const structureButton = document.querySelector('.page-structure');
            if (structureButton) {
              structureButton.querySelector('.nb-translate').textContent =
                'Hide Page Structure';
              structureButton.classList.add('active');
            }
          } else {
            // Hide the page structure
            pageStructureDiv.style.display = 'none';

            // Update button text and remove highlight
            const structureButton = document.querySelector('.page-structure');
            if (structureButton) {
              structureButton.querySelector('.nb-translate').textContent =
                'Page Structure';
              structureButton.classList.remove('active');
            }
          }
        }

        function reset() {
          localStorage.clear();
          originalStyles.clear();

          document
            .querySelectorAll(
              'body *:not(.nb-menu):not(.nb-menu *):not(.material-icons)',
            )
            .forEach((el) => {
              if (originalStyles.has(el)) {
                const styles = originalStyles.get(el);
                if (styles.fontSize) el.style.fontSize = styles.fontSize;
                if (styles.lineHeight) el.style.lineHeight = styles.lineHeight;
                if (styles.letterSpacing)
                  el.style.letterSpacing = styles.letterSpacing;
                if (styles.fontFamily) el.style.fontFamily = styles.fontFamily;
                if (styles.fontWeight) el.style.fontWeight = styles.fontWeight;
              } else {
                el.style.fontSize = '';
                el.style.lineHeight = '';
                el.style.letterSpacing = '';
                el.style.fontFamily = '';
                el.style.fontWeight = '';
              }
            });

          document
            .querySelectorAll(
              'h1:not(.nb-menu *), h2:not(.nb-menu *), h3:not(.nb-menu *)',
            )
            .forEach((el) => {
              if (originalStyles.has(el)) {
                const styles = originalStyles.get(el);
                if (styles.color) el.style.color = styles.color;
                if (styles.textDecoration)
                  el.style.textDecoration = styles.textDecoration;
              } else {
                el.style.color = '';
                el.style.textDecoration = '';
              }
            });

          document
            .querySelectorAll(
              'a:not(.nb-menu *), button:not(.nb-btn):not(.nb-reset-btn):not(.nb-menu *)',
            )
            .forEach((el) => {
              if (originalStyles.has(el)) {
                const styles = originalStyles.get(el);
                if (styles.color) el.style.color = styles.color;
                if (styles.textDecoration)
                  el.style.textDecoration = styles.textDecoration;
              } else {
                el.style.color = '';
                el.style.textDecoration = '';
              }
            });

          document.body.style.cursor = 'default';

          if (originalStyles.has(document.documentElement)) {
            const styles = originalStyles.get(document.documentElement);
            document.documentElement.style.backgroundColor =
              styles.backgroundColor;
            document.documentElement.style.color = styles.color;
            document.documentElement.style.filter = '';
          } else {
            document.documentElement.style.backgroundColor = '';
            document.documentElement.style.color = '';
            document.documentElement.style.filter = '';
          }

          const widget = document.querySelector('.nb-menu');
          if (widget) {
            widget.style.backgroundColor = '#f9f9f9';
            widget.style.color = '#000';
            widget.style.filter = '';
            document.querySelectorAll('.nb-menu *').forEach((el) => {
              el.style.color = '';
              el.style.backgroundColor = '';
              el.style.filter = '';
            });
          }

          document
            .querySelectorAll(
              'h1:not(.nb-menu *), h2:not(.nb-menu *), h3:not(.nb-menu *), h4:not(.nb-menu *), h5:not(.nb-menu *), h6:not(.nb-menu *), p:not(.nb-menu *), li:not(.nb-menu *), a:not(.nb-menu *), span:not(.material-icons):not(.nb-menu *), div:not(.nb-menu):not(.nb-menu *)',
            )
            .forEach((el) => {
              if (originalStyles.has(el)) {
                const styles = originalStyles.get(el);
                if (styles.textAlign) el.style.textAlign = styles.textAlign;
              } else {
                el.style.textAlign = '';
              }
            });

          // Hide page structure on reset
          const pageStructureDiv = document.getElementById('pageStructure');
          if (pageStructureDiv) {
            pageStructureDiv.style.display = 'none';
            localStorage.setItem('pageStructure', 'false');
          }

          // Reset button highlights
          document.querySelectorAll('.nb-btn').forEach((button) => {
            button.classList.remove('active');
          });

          const contrastButton = document.querySelector(
            '.contrast-toggle .nb-translate',
          );
          if (contrastButton) contrastButton.textContent = 'Contrast';

          const cursorButton = document.querySelector(
            '.cursor-toggle .nb-translate',
          );
          if (cursorButton) cursorButton.textContent = 'Bigger Cursor';

          const alignButton = document.querySelector(
            '.text-align-toggle .material-icons',
          );
          if (alignButton) alignButton.textContent = 'format_align_left';

          const structureButton = document.querySelector(
            '.page-structure .nb-translate',
          );
          if (structureButton) structureButton.textContent = 'Page Structure';
        }
        // Bind event listeners to buttons (replace inline onclicks)
        const bindButtons = () => {
          const buttonMap = [
            {
              selector: '.nb-btn.font-increase',
              handler: () => adjustFontSize(0.1),
            },
            {
              selector: '.nb-btn.font-decrease',
              handler: () => adjustFontSize(-0.1),
            },
            {
              selector: '.nb-btn.line-height-increase',
              handler: () => adjustLineHeight(0.25),
            },
            {
              selector: '.nb-btn.line-height-decrease',
              handler: () => adjustLineHeight(-0.25),
            },
            {
              selector: '.nb-btn.letter-spacing-increase',
              handler: () => adjustLetterSpacing(0.1),
            },
            {
              selector: '.nb-btn.letter-spacing-decrease',
              handler: () => adjustLetterSpacing(-0.1),
            },
            {
              selector: '.nb-btn.font-weight-toggle',
              handler: adjustFontWeight,
            },
            { selector: '.nb-btn.dyslexic-font', handler: enableDyslexicFont },
            {
              selector: '.nb-btn.highlight-headings',
              handler: enableHighlightHeadings,
            },
            {
              selector: '.nb-btn.highlight-links',
              handler: enableHighlightLinks,
            },
            { selector: '.nb-btn.cursor-toggle', handler: enableBigCursor },
            { selector: '.nb-btn.contrast-toggle', handler: adjustContrast },
            { selector: '.nb-btn.text-align-toggle', handler: adjustTextAlign },
            { selector: '.nb-btn.page-structure', handler: showPageStructure },
            { selector: '.nb-reset-btn', handler: reset },
            { selector: '.nb-menu-close', handler: toggleMenu },
          ];

          buttonMap.forEach(({ selector, handler }) => {
            const btn = document.querySelector(selector);
            if (btn) {
              btn.addEventListener('click', handler);
            }
          });
        };

        bindButtons();

        window.addEventListener('load', () => {
          if (localStorage.getItem('fontScale')) adjustFontSize(0);
          if (localStorage.getItem('lineHeight')) adjustLineHeight(0);
          if (localStorage.getItem('letterSpacing')) adjustLetterSpacing(0);
          if (localStorage.getItem('dyslexicFont') === 'true')
            enableDyslexicFont();
          if (localStorage.getItem('highlightHeadings') === 'true')
            enableHighlightHeadings();
          if (localStorage.getItem('highlightLinks') === 'true')
            enableHighlightLinks();
          if (
            localStorage.getItem('fontWeight') &&
            localStorage.getItem('fontWeightEnabled') === 'true'
          )
            adjustFontWeight();
          if (
            localStorage.getItem('cursorSize') &&
            localStorage.getItem('cursorSize') !== 'default'
          )
            enableBigCursor();
          if (
            localStorage.getItem('contrastMode') &&
            localStorage.getItem('contrastMode') !== 'off'
          )
            adjustContrast();
          if (localStorage.getItem('textAlign')) adjustTextAlign();
          if (localStorage.getItem('pageStructure') === 'true')
            showPageStructure();
        });
      });
    },
  };
})(Drupal, once);

