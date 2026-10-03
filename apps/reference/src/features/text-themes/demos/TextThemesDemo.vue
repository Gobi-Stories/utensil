<template>
  <div id="text-themes" class="component-demo utensil-theme-semantics">
    <UtensilTheme class="text-demo-container" text="content">
      <h1>Main Heading</h1>
      <h2>Section Heading</h2>
      <h3>Subsection Heading</h3>
      <p>
        This is a paragraph of text demonstrating the content text theme. It features more comfortable line heights and
        larger font sizes optimized for reading longer passages of text.
      </p>
      <p>
        <strong>Bold text</strong> and <em>italic text</em> provide emphasis where needed. The increased spacing makes
        it easier to scan and comprehend content.
      </p>
      <ul>
        <li>List item with more breathing room</li>
        <li>Second list item with comfortable spacing</li>
        <li>Third list item for demonstration</li>
      </ul>
      <p>Inline <code>code snippet</code> integrates smoothly with body text.</p>
      <pre><code><span class="syn-keyword">function</span> <span class="syn-function">example</span><span class="syn-punctuation">()</span> <span class="syn-punctuation">{</span>
  <span class="syn-keyword">return</span> <span class="syn-string">'code block with more padding'</span><span class="syn-punctuation">;</span>
<span class="syn-punctuation">}</span></code></pre>
      <blockquote>A blockquote styled for content consumption with enhanced visual prominence.</blockquote>
      <p><a href="#">A link styled for content reading</a></p>
      <hr />
      <p><small>Small text for secondary information</small></p>
    </UtensilTheme>
    <h4 class="theme-title">Content</h4>
    <p class="theme-description">
      Optimized for reading with generous spacing, larger text, and selectable content by default.
    </p>

    <ReferenceTheme class="text-demo-container article" text="article">
      <h1>The Art of Typography</h1>
      <h2>Understanding Readability</h2>
      <p class="drop-cap">
        Typography is the art and technique of arranging type to make written language legible, readable, and appealing
        when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing,
        and letter-spacing.
      </p>
      <p>
        When designing for reading, considerations go beyond mere aesthetics. <strong>Readability</strong> and
        <em>legibility</em> are paramount concerns that directly impact how well readers can consume and comprehend the
        content.
      </p>
      <h3>Key Principles</h3>
      <ul>
        <li>Choose appropriate typefaces for the content type</li>
        <li>Maintain comfortable line lengths (45-75 characters)</li>
        <li>Use generous line spacing for body text</li>
        <li>Create clear hierarchy with heading sizes</li>
      </ul>
      <blockquote>Good typography is invisible. Bad typography is everywhere.</blockquote>
      <p>For more information, see the <a href="#">typography guidelines</a>.</p>
    </ReferenceTheme>
    <h4 class="theme-title">Article</h4>
    <p class="theme-description">Serif typography optimized for long-form article reading with elegant spacing.</p>

    <ReferenceTheme class="text-demo-container" text="code">
      <h1>API Documentation</h1>
      <h2>Function Reference</h2>
      <p>The <code>createElement()</code> function creates a new element node in the document.</p>
      <h3>Syntax</h3>
      <pre><code><span class="syn-keyword">const</span> <span class="syn-variable">element</span> <span class="syn-punctuation">=</span> <span class="syn-variable">document</span><span class="syn-punctuation">.</span><span class="syn-function">createElement</span><span class="syn-punctuation">(</span><span class="syn-variable">tagName</span><span class="syn-punctuation">);</span>
<span class="syn-keyword">const</span> <span class="syn-variable">element</span> <span class="syn-punctuation">=</span> <span class="syn-variable">document</span><span class="syn-punctuation">.</span><span class="syn-function">createElement</span><span class="syn-punctuation">(</span><span class="syn-variable">tagName</span><span class="syn-punctuation">,</span> <span class="syn-variable">options</span><span class="syn-punctuation">);</span></code></pre>
      <h3>Parameters</h3>
      <ul>
        <li><code>tagName</code> - A string specifying the type of element</li>
        <li><code>options</code> - An optional ElementCreationOptions object</li>
      </ul>
      <h3>Return Value</h3>
      <p>Returns the new <code>Element</code> instance.</p>
      <h3>Example</h3>
      <pre><code><span class="syn-comment">// Create a div element</span>
<span class="syn-keyword">const</span> <span class="syn-variable">div</span> <span class="syn-punctuation">=</span> <span class="syn-variable">document</span><span class="syn-punctuation">.</span><span class="syn-function">createElement</span><span class="syn-punctuation">(</span><span class="syn-string">'div'</span><span class="syn-punctuation">);</span>
<span class="syn-variable">div</span><span class="syn-punctuation">.</span><span class="syn-property">className</span> <span class="syn-punctuation">=</span> <span class="syn-string">'container'</span><span class="syn-punctuation">;</span>
<span class="syn-variable">div</span><span class="syn-punctuation">.</span><span class="syn-property">textContent</span> <span class="syn-punctuation">=</span> <span class="syn-string">'Hello World'</span><span class="syn-punctuation">;</span>

<span class="syn-comment">// Append to body</span>
<span class="syn-variable">document</span><span class="syn-punctuation">.</span><span class="syn-property">body</span><span class="syn-punctuation">.</span><span class="syn-function">appendChild</span><span class="syn-punctuation">(</span><span class="syn-variable">div</span><span class="syn-punctuation">);</span></code></pre>
      <blockquote><em>Note:</em> Custom elements must contain a hyphen in their name.</blockquote>
      <p>See also: <a href="#">removeElement()</a>, <a href="#">querySelector()</a></p>
    </ReferenceTheme>
    <h4 class="theme-title">Code</h4>
    <p class="theme-description">Monospace throughout, optimized for technical documentation and code samples.</p>

    <UtensilTheme class="text-demo-container" text="ui">
      <h1>Main Heading</h1>
      <h2>Section Heading</h2>
      <h3>Subsection Heading</h3>
      <p>This is a paragraph of text demonstrating the UI text theme. It's compact and efficient for interface use.</p>
      <p>
        It doesn't read well in long form text as the elements are designed to remove surrounding space, allowing them
        to be placed more easily within UI components.
      </p>
      <p><strong>Bold text</strong> and <em>italic text</em> for emphasis.</p>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      <p>Inline <code>code snippet</code> for technical references.</p>
      <pre><code><span class="syn-keyword">function</span> <span class="syn-function">example</span><span class="syn-punctuation">()</span> <span class="syn-punctuation">{</span>
  <span class="syn-keyword">return</span> <span class="syn-string">'code block'</span><span class="syn-punctuation">;</span>
<span class="syn-punctuation">}</span></code></pre>
      <blockquote>A blockquote for cited content or emphasis.</blockquote>
      <p><a href="#">A link to another page</a></p>
    </UtensilTheme>
    <h4 class="theme-title">User Interface</h4>
    <p class="theme-description">
      Optimized for application interfaces with compact spacing and non-selectable text by default.
    </p>
  </div>
</template>

<script setup lang="ts">
import UtensilTheme from 'utensil-vue/theme/UtensilTheme.vue'
import { ReferenceTheme } from '@/theme/ReferenceTheme'
</script>

<style scoped>
.component-demo {
  width: 60%;
  min-width: 480px;
  align-self: center;

  & > h4 {
    color: var(--pencil-11);
    font-weight: 100;
    margin-top: var(--space-5);
    margin-bottom: var(--space-2);

    &:first-child {
      margin-top: 0;
    }
  }
}

.utensil-rounded .component-demo h4 {
  margin-bottom: var(--space-2);
  margin-left: var(--space-5);
}

.component-demo > p {
  margin-bottom: var(--space-4);
  color: var(--pencil-11);
}

h4.theme-title {
  margin-bottom: var(--space-3);
  margin-top: var(--space-2);
  text-align: center;
}

p.theme-description {
  display: none;
}

.text-demo-container {
  background-color: var(--panel-translucent);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-3);
  padding: var(--space-6);
  margin: var(--space-9) 0 0;

  &.article {
    & > h1 {
      margin-bottom: 16px;
    }

    & > h2 {
      margin-bottom: 40px;
    }

    & > h3 {
      margin-top: 40px;
    }
  }
}

@container size-container (max-width: 576px) {
  .component-demo {
    width: 100%;
    min-width: unset;
  }

  .text-demo-container:first-child {
    margin-top: 0;
  }
}

/* Syntax highlighting — hardcoded colors simulating a third-party library */
.syn-keyword {
  color: #c678dd;
}

.syn-string {
  color: #98c379;
}

.syn-comment {
  color: #5c6370;
  font-style: italic;
}

.syn-function {
  color: #61afef;
}

.syn-variable {
  color: #e5c07b;
}

.syn-property {
  color: #e06c75;
}

.syn-punctuation {
  color: #abb2bf;
}

.light-mode {
  .component-demo {
    & > h4 {
      color: var(--pencil-a11);
      font-weight: 400;
    }
  }

  .text-demo-container {
    background-color: var(--pencil-1);
  }

  .syn-keyword {
    color: #a626a4;
  }

  .syn-string {
    color: #50a14f;
  }

  .syn-comment {
    color: #a0a1a7;
  }

  .syn-function {
    color: #4078f2;
  }

  .syn-variable {
    color: #c18401;
  }

  .syn-property {
    color: #e45649;
  }

  .syn-punctuation {
    color: #383a42;
  }
}
</style>
