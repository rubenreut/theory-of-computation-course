import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Glossary from './glossary/Glossary';
import InteractiveExamples from './InteractiveExamples';
import VisualComparisons from './VisualComparisons';
import CheatSheet from './CheatSheet';
import TooltipText from './TooltipText';

const ExplanationContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  margin-top: 0;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #444;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const SubsectionTitle = styled.h3`
  color: #555;
  margin-top: 20px;
`;

const TopicTitle = styled.h4`
  color: #666;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 8px;
`;

const List = styled.ul`
  margin-left: 20px;
  margin-bottom: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.5;
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  margin: 15px 0;
`;

const Example = styled.div`
  background-color: #f8f9fa;
  border-left: 4px solid #4CAF50;
  padding: 15px;
  margin: 15px 0;
`;

const TableOfContents = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const TOCLink = styled.div`
  margin: 5px 0;
  cursor: pointer;
  color: #2196f3;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChevronIcon = styled.span`
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#4CAF50' : '#757575'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-bottom: 3px solid ${props => props.active ? '#4CAF50' : 'transparent'};
  
  &:hover {
    color: #4CAF50;
    background-color: #f5f5f5;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

function Explanation() {
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    fundamental: false,
    classifications: false,
    transformations: false,
    parsing: false,
    properties: false,
    applications: false,
    advanced: false
  });
  
  // State to track active tab
  const [activeTab, setActiveTab] = useState('content');
  
  // Reference for the glossary section
  const glossaryRef = useRef(null);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Expand the section
      const sectionKey = sectionId.split('-')[0];
      if (!expandedSections[sectionKey]) {
        toggleSection(sectionKey);
      }
    }
  };
  
  // Handle clicking on a term in tooltips
  const handleTermClick = (term) => {
    setActiveTab('glossary');
    if (glossaryRef.current) {
      // Give time for the tab to become visible
      setTimeout(() => {
        glossaryRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  return (
    <ExplanationContainer>
      <Title>Context-Free Grammars: A Comprehensive Guide</Title>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          Learning Content
        </Tab>
        <Tab 
          active={activeTab === 'glossary'} 
          onClick={() => setActiveTab('glossary')}
        >
          Glossary
        </Tab>
        <Tab 
          active={activeTab === 'interactive'} 
          onClick={() => setActiveTab('interactive')}
        >
          Interactive Exercises
        </Tab>
        <Tab 
          active={activeTab === 'comparisons'} 
          onClick={() => setActiveTab('comparisons')}
        >
          Visual Comparisons
        </Tab>
        <Tab 
          active={activeTab === 'cheatsheet'} 
          onClick={() => setActiveTab('cheatsheet')}
        >
          Cheat Sheet
        </Tab>
      </TabsContainer>
      
      <TabContent active={activeTab === 'content'}>
        <TableOfContents>
          <h3>Table of Contents</h3>
          <TOCLink onClick={() => scrollToSection('intro-section')}>Introduction to Context-Free Grammars</TOCLink>
          <TOCLink onClick={() => scrollToSection('fundamental-concepts')}>Fundamental Concepts</TOCLink>
          <TOCLink onClick={() => scrollToSection('classifications-section')}>Grammar Classifications</TOCLink>
          <TOCLink onClick={() => scrollToSection('transformations-section')}>Grammar Transformations</TOCLink>
          <TOCLink onClick={() => scrollToSection('parsing-algorithms')}>Parsing Algorithms</TOCLink>
          <TOCLink onClick={() => scrollToSection('properties-analysis')}>Properties and Analysis</TOCLink>
          <TOCLink onClick={() => scrollToSection('applications-section')}>Applications</TOCLink>
          <TOCLink onClick={() => scrollToSection('advanced-topics')}>Advanced Topics</TOCLink>
        </TableOfContents>
        
        <Section id="intro-section">
          <SectionTitle onClick={() => toggleSection('intro')}>
            Introduction to Context-Free Grammars
            <ChevronIcon expanded={expandedSections.intro}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.intro && (
            <>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A Context-Free Grammar (CFG) is a formal grammar used to describe the syntax of languages. It consists of a set of rules (productions) that specify how strings can be generated in the language. CFGs are more powerful than regular expressions but less powerful than Turing machines in the Chomsky hierarchy.
                </TooltipText>
              </p>
              
              <SubsectionTitle>Components of a CFG</SubsectionTitle>
              <p><TooltipText moreInfoCallback={handleTermClick}>A context-free grammar G is defined by the 4-tuple G = (V, Σ, R, S), where:</TooltipText></p>
              <List>
                <ListItem><strong>V</strong> is a finite set of non-terminal symbols</ListItem>
                <ListItem><strong>Σ</strong> is a finite set of terminal symbols (disjoint from V)</ListItem>
                <ListItem><strong>R</strong> is a finite set of production rules of the form A → α, where A ∈ V and α ∈ (V ∪ Σ)*</ListItem>
                <ListItem><strong>S</strong> is the start symbol (S ∈ V)</ListItem>
              </List>
              
              <Example>
                <SubsectionTitle>Example: A simple CFG for balanced parentheses</SubsectionTitle>
                <p>V = &#123;S&#125;<br />
                Σ = &#123;(, )&#125;<br />
                R = &#123;S → (S), S → SS, S → {'ε'}&#125;<br />
                Start symbol = S</p>
                
                <p>This grammar generates strings like: (), (()), ()(), (()()), etc.</p>
              </Example>
            </>
          )}
        </Section>
        
        <Section id="fundamental-concepts">
          <SectionTitle onClick={() => toggleSection('fundamental')}>
            Fundamental Concepts
            <ChevronIcon expanded={expandedSections.fundamental}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.fundamental && (
            <>
              <TopicTitle>1. Formal Definition of a CFG</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A context-free grammar is formally defined as a 4-tuple G = (V, Σ, R, S), where:
                  <ul>
                    <li>V is a finite set of non-terminal symbols</li>
                    <li>&Sigma; is a finite set of terminal symbols (disjoint from V)</li>
                    <li>R is a finite set of production rules of the form A &rarr; &alpha;, where A &isin; V and &alpha; &isin; (V &cup; &Sigma;)*</li>
                    <li>S is the start symbol (S &isin; V)</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>2. Derivations (Leftmost and Rightmost)</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A derivation is a sequence of production rule applications that transform the start symbol into a string of terminals. The two main types are:
                </TooltipText>
              </p>
              <List>
                <ListItem><strong>Leftmost derivation</strong>: <TooltipText moreInfoCallback={handleTermClick}>Always replace the leftmost non-terminal first</TooltipText></ListItem>
                <ListItem><strong>Rightmost derivation</strong>: <TooltipText moreInfoCallback={handleTermClick}>Always replace the rightmost non-terminal first</TooltipText></ListItem>
              </List>
              
              <Example>
                <p>For the grammar with rules S &rarr; SS | (S) | &epsilon;, a leftmost derivation of "()()" would be:</p>
                <CodeBlock>
                  S &rArr; SS &rArr; (S)S &rArr; ()S &rArr; ()(S) &rArr; ()()
                </CodeBlock>
              </Example>
              
              <TopicTitle>3. Parse Trees and Their Relationship to Derivations</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A parse tree (or derivation tree) is a visual representation of a derivation, showing how the start symbol is expanded into the final string. Parse trees have:
                  <ul>
                    <li>The start symbol as the root node</li>
                    <li>Non-terminals as internal nodes</li>
                    <li>Terminals as leaf nodes</li>
                    <li>Edges representing the application of production rules</li>
                  </ul>
                  
                  Every parse tree corresponds to a rightmost or leftmost derivation, but in ambiguous grammars, multiple parse trees may exist for the same string.
                </TooltipText>
              </p>
              
              <TopicTitle>4. The Language Generated by a CFG</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  The language L(G) generated by a grammar G is the set of all strings of terminals that can be derived from the start symbol S. Formally:
                  <CodeBlock>
                    L(G) = &#123;w &isin; &Sigma;* | S &rArr;* w&#125;
                  </CodeBlock>
                  where &rArr;* represents the reflexive transitive closure of the derivation relation.
                </TooltipText>
              </p>
              
              <TopicTitle>5. Sentential Forms and Sentences</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  <ul>
                    <li><strong>Sentential form</strong>: Any string of terminals and non-terminals that can be derived from the start symbol</li>
                    <li><strong>Sentence</strong>: A sentential form that contains only terminal symbols</li>
                  </ul>
                  
                  The language of a grammar consists precisely of all sentences (terminal strings) that can be derived from the start symbol.
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="classifications-section">
          <SectionTitle onClick={() => toggleSection('classifications')}>
            Grammar Classifications
            <ChevronIcon expanded={expandedSections.classifications}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.classifications && (
            <>
              <TopicTitle>6. Chomsky Normal Form (CNF)</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A grammar is in Chomsky Normal Form if every production rule is of one of these forms:
                  <ul>
                    <li>A → BC (where A, B, C are non-terminals and B and C are not the start symbol)</li>
                    <li>A → a (where A is a non-terminal and a is a terminal)</li>
                    <li>S → {'ε'} (only if S is the start symbol and S does not appear on the right side of any rule)</li>
                  </ul>
                  
                  Any context-free grammar can be converted to an equivalent grammar in CNF. This form is particularly useful for parsing algorithms like CYK.
                </TooltipText>
              </p>
              
              <TopicTitle>7. Greibach Normal Form (GNF)</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A grammar is in Greibach Normal Form if every production rule is of the form:
                  <ul>
                    <li>A → a{'α'} (where A is a non-terminal, a is a terminal, and {'α'} is a (possibly empty) string of non-terminals)</li>
                  </ul>
                  
                  GNF is useful for proving theoretical properties and for certain types of parsers.
                </TooltipText>
              </p>
              
              <TopicTitle>8. LL(k) Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  LL(k) grammars can be parsed by a top-down parser that reads the input from Left to right and constructs a Leftmost derivation, using k tokens of lookahead. LL(1) grammars are particularly important in practice, as they:
                  <ul>
                    <li>Can be parsed efficiently using a parsing table</li>
                    <li>Cannot be left-recursive (rules like A &rarr; A&alpha;)</li>
                    <li>Require that for any non-terminal A, all rules A &rarr; &alpha; must have disjoint FIRST sets</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>9. LR(k) Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  LR(k) grammars can be parsed by a bottom-up parser that reads the input from Left to right and constructs a Rightmost derivation in reverse, using k tokens of lookahead. LR grammars are more powerful than LL grammars, allowing:
                  <ul>
                    <li>Left recursion</li>
                    <li>Common prefixes in production rules</li>
                    <li>More expressive language specification</li>
                  </ul>
                  
                  Common variants include LR(0), SLR(1), LALR(1), and canonical LR(1).
                </TooltipText>
              </p>
              
              <TopicTitle>10. Ambiguous vs. Unambiguous Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  <ul>
                    <li><strong>Ambiguous grammar</strong>: A grammar is ambiguous if there exists at least one string in the language with more than one distinct parse tree (or equivalently, more than one leftmost or rightmost derivation).</li>
                    <li><strong>Unambiguous grammar</strong>: A grammar where every string in the language has exactly one parse tree.</li>
                  </ul>
                  
                  Ambiguity is often undesirable in programming language grammars as it leads to parsing conflicts. Common examples of ambiguity include the "dangling else" problem and expression grammars without precedence rules.
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="transformations-section">
          <SectionTitle onClick={() => toggleSection('transformations')}>
            Grammar Transformations
            <ChevronIcon expanded={expandedSections.transformations}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.transformations && (
            <>
              <TopicTitle>11. Eliminating ε-Productions</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  {'ε'}-productions (rules of the form A → {'ε'}) can be eliminated by:
                  <ol>
                    <li>Identifying all nullable non-terminals (those that can derive {'ε'})</li>
                    <li>For each production containing nullable non-terminals, adding new productions that represent all possible combinations of including or excluding those nullable non-terminals</li>
                    <li>Removing the original {'ε'}-productions</li>
                  </ol>
                  Special care must be taken when the start symbol is nullable.
                </TooltipText>
              </p>
              
              <TopicTitle>12. Eliminating Unit Productions</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Unit productions (rules of the form A → B where B is a non-terminal) can be eliminated by:
                  <ol>
                    <li>Computing the unit pairs (A,B) representing that A can derive B through a sequence of unit productions</li>
                    <li>For each unit pair (A,B) and each non-unit production B → γ, adding a new production A → γ</li>
                    <li>Removing all unit productions</li>
                  </ol>
                </TooltipText>
              </p>
              
              <TopicTitle>13. Eliminating Useless Productions</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Useless productions involve symbols that either:
                  <ul>
                    <li><strong>Non-productive</strong>: Cannot derive any terminal string</li>
                    <li><strong>Non-reachable</strong>: Cannot be reached from the start symbol in any derivation</li>
                  </ul>
                  
                  Elimination involves:
                  <ol>
                    <li>Identifying all productive symbols (can derive terminal strings)</li>
                    <li>Removing all productions with non-productive symbols</li>
                    <li>Identifying all reachable symbols (can be reached from the start symbol)</li>
                    <li>Removing all productions with non-reachable symbols</li>
                  </ol>
                </TooltipText>
              </p>
              
              <TopicTitle>14. Converting to Chomsky Normal Form</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Converting a CFG to CNF involves several steps:
                  <ol>
                    <li>Eliminate {'ε'}-productions (except potentially S → {'ε'})</li>
                    <li>Eliminate unit productions</li>
                    <li>Replace terminals in mixed productions (e.g., A → aB becomes A → XB, X → a)</li>
                    <li>Break long right-hand sides (e.g., A → BCD becomes A → BY, Y → CD)</li>
                  </ol>
                </TooltipText>
              </p>
              
              <TopicTitle>15. Converting to Greibach Normal Form</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Converting a CFG to GNF usually follows these steps:
                  <ol>
                    <li>Convert to CNF first</li>
                    <li>Eliminate left recursion</li>
                    <li>Transform rules so a terminal appears first on the right-hand side</li>
                  </ol>
                  The process is more complex than CNF conversion and involves careful handling of non-terminal orderings.
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="parsing-algorithms">
          <SectionTitle onClick={() => toggleSection('parsing')}>
            Parsing Algorithms
            <ChevronIcon expanded={expandedSections.parsing}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.parsing && (
            <>
              <TopicTitle>16. Recursive Descent Parsing</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  A top-down parsing technique where each non-terminal in the grammar is implemented as a function that recognizes the language generated by that non-terminal. Key characteristics:
                  <ul>
                    <li>Easy to implement by hand</li>
                    <li>Cannot handle left recursion directly</li>
                    <li>May require backtracking for certain grammars</li>
                    <li>Predictive recursive descent parsers eliminate backtracking using lookahead</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>17. LL(1) Parsing and Predictive Parsing Tables</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  LL(1) parsing uses a parsing table to guide decisions in a non-backtracking top-down parse. To build an LL(1) parsing table:
                  <ol>
                    <li>Compute FIRST and FOLLOW sets for all symbols</li>
                    <li>For each rule A &rarr; &alpha;, place it in table entry [A, a] for each terminal a in FIRST(&alpha;)</li>
                    <li>If &epsilon; is in FIRST(&alpha;), place A &rarr; &alpha; in table entry [A, b] for each b in FOLLOW(A)</li>
                  </ol>
                  A grammar is LL(1) if no table cell contains multiple entries (no parsing conflicts).
                </TooltipText>
              </p>
              
              <TopicTitle>18-21. LR Parsing Family (LR(0), SLR(1), LALR(1), LR(1))</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  LR parsers are bottom-up parsers that build a rightmost derivation in reverse. The family includes:
                  
                  <ul>
                    <li><strong>LR(0)</strong>: Uses LR(0) items (productions with a dot position) without lookahead</li>
                    <li><strong>SLR(1)</strong>: Extends LR(0) by using FOLLOW sets to resolve reduce actions</li>
                    <li><strong>LALR(1)</strong>: Merges states in canonical LR(1) with identical LR(0) cores</li>
                    <li><strong>Canonical LR(1)</strong>: Uses LR(1) items (LR(0) items with a lookahead symbol)</li>
                  </ul>
                  
                  These parsers have increasing power (LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1)) but also increasing complexity.
                </TooltipText>
              </p>
              
              <TopicTitle>22. CYK (Cocke-Younger-Kasami) Algorithm</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  The CYK algorithm is a dynamic programming approach for parsing strings using grammars in Chomsky Normal Form. Key features:
                  <ul>
                    <li>O(n³) time complexity where n is the length of the input</li>
                    <li>Builds a parse table bottom-up</li>
                    <li>Works for all context-free grammars (after conversion to CNF)</li>
                    <li>Determines if a string is in the language and can extract all possible parse trees</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>23. Earley Parsing Algorithm</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  The Earley algorithm is a versatile parsing algorithm that works for all context-free grammars, including ambiguous ones:
                  <ul>
                    <li>O(n³) time complexity in the worst case, but O(n²) for unambiguous grammars and O(n) for certain classes</li>
                    <li>Dynamic programming approach using chart parsing</li>
                    <li>Does not require grammar transformations</li>
                    <li>Uses dotted rules (like LR items) and handles both top-down prediction and bottom-up completion</li>
                  </ul>
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="properties-analysis">
          <SectionTitle onClick={() => toggleSection('properties')}>
            Properties and Analysis
            <ChevronIcon expanded={expandedSections.properties}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.properties && (
            <>
              <TopicTitle>24. Pumping Lemma for Context-Free Languages</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  The pumping lemma states that for any context-free language L, there exists a pumping length p such that any string s in L with |s| &ge; p can be divided into five parts s = uvxyz such that:
                  <ol>
                    <li>|vy| &gt; 0 (v and y cannot both be empty)</li>
                    <li>|vxy| &le; p (the middle portion is not too long)</li>
                    <li>For all i &ge; 0, uv<sup>i</sup>xy<sup>i</sup>z is in L</li>
                  </ol>
                  
                  This lemma is primarily used to prove that certain languages are not context-free, through proof by contradiction.
                </TooltipText>
              </p>
              
              <TopicTitle>25. Closure Properties of CFLs</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Context-free languages are closed under the following operations:
                  <ul>
                    <li>Union (L₁ &cup; L₂)</li>
                    <li>Concatenation (L₁ &middot; L₂)</li>
                    <li>Kleene star (L*)</li>
                    <li>Substitution</li>
                    <li>Homomorphism</li>
                    <li>Inverse homomorphism</li>
                  </ul>
                  
                  However, CFLs are NOT closed under:
                  <ul>
                    <li>Intersection</li>
                    <li>Complement</li>
                    <li>Difference</li>
                  </ul>
                  
                  An important exception: CFLs are closed under intersection with regular languages.
                </TooltipText>
              </p>
              
              <TopicTitle>26. Decision Problems for CFGs</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  There are several key decision problems for context-free grammars:
                  <ul>
                    <li><strong>Membership problem</strong>: Is a string w in the language L(G)? (Decidable)</li>
                    <li><strong>Emptiness problem</strong>: Is L(G) empty? (Decidable)</li>
                    <li><strong>Finiteness problem</strong>: Is L(G) finite? (Decidable)</li>
                    <li><strong>Equivalence problem</strong>: Given two CFGs G₁ and G₂, is L(G₁) = L(G₂)? (Undecidable)</li>
                    <li><strong>Ambiguity problem</strong>: Is grammar G ambiguous? (Undecidable)</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>27. Relationship to Pushdown Automata</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Context-free languages and pushdown automata (PDAs) are closely related:
                  <ul>
                    <li>A language is context-free if and only if it is accepted by some pushdown automaton</li>
                    <li>Deterministic PDAs accept a proper subset of CFLs known as deterministic context-free languages (DCFLs)</li>
                    <li>PDAs extend finite automata with a stack, allowing them to recognize nested structures</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>28. Intersection with Regular Languages</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  The intersection of a context-free language and a regular language is always context-free. This property:
                  <ul>
                    <li>Is useful for constructing complex context-free languages</li>
                    <li>Can be used to prove certain languages are not context-free</li>
                    <li>Has a constructive proof using the product of a PDA and a finite automaton</li>
                  </ul>
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="applications-section">
          <SectionTitle onClick={() => toggleSection('applications')}>
            Applications
            <ChevronIcon expanded={expandedSections.applications}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.applications && (
            <>
              <TopicTitle>29. Programming Language Syntax Definition</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Context-free grammars are fundamental in defining programming language syntax:
                  <ul>
                    <li>EBNF (Extended Backus-Naur Form) is commonly used to specify programming language grammars</li>
                    <li>Grammar definitions serve as the formal specification of a language's syntax</li>
                    <li>They provide a basis for generating parser code automatically through parser generators</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>30. Compiler Front-End Design</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  In compiler design, CFGs play a critical role in the front-end:
                  <ul>
                    <li>The lexer breaks input into tokens that become terminals in the grammar</li>
                    <li>The parser uses the CFG to analyze the syntactic structure</li>
                    <li>Parse trees or abstract syntax trees represent the program structure</li>
                    <li>Parser generators like YACC, Bison, ANTLR convert CFGs into parsers automatically</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>31. Natural Language Processing</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  CFGs are used in computational linguistics and NLP:
                  <ul>
                    <li>Modeling syntactic structure of natural languages</li>
                    <li>Constituency parsing of sentences</li>
                    <li>Advanced models include probabilistic CFGs and feature-based grammars</li>
                    <li>Foundation for more complex grammars like Tree-Adjoining Grammars</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>32. XML and HTML Document Validation</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  XML, HTML, and other markup languages use grammar-based validation:
                  <ul>
                    <li>DTDs (Document Type Definitions) specify the structure of valid documents</li>
                    <li>XML Schema and RELAX NG provide more sophisticated grammar-like validation</li>
                    <li>The nested structure of markup languages maps naturally to context-free grammar rules</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>33. Bioinformatics Sequence Analysis</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  CFGs have applications in bioinformatics:
                  <ul>
                    <li>Modeling RNA secondary structure</li>
                    <li>Stochastic CFGs (SCFGs) for sequence alignment and structure prediction</li>
                    <li>Gene finding and protein structure analysis</li>
                  </ul>
                </TooltipText>
              </p>
            </>
          )}
        </Section>
        
        <Section id="advanced-topics">
          <SectionTitle onClick={() => toggleSection('advanced')}>
            Advanced Topics
            <ChevronIcon expanded={expandedSections.advanced}>▼</ChevronIcon>
          </SectionTitle>
          
          {expandedSections.advanced && (
            <>
              <TopicTitle>34. Attribute Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Attribute grammars extend CFGs by associating attributes with grammar symbols and defining rules for computing these attributes:
                  <ul>
                    <li><strong>Synthesized attributes</strong>: Pass information up the parse tree</li>
                    <li><strong>Inherited attributes</strong>: Pass information down the parse tree</li>
                    <li>Useful for type checking, code generation, and semantic analysis</li>
                    <li>Foundation for many compiler implementations</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>35. Abstract Syntax Trees</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Abstract Syntax Trees (ASTs) are simplified parse trees that:
                  <ul>
                    <li>Omit syntactic details not needed for semantic analysis</li>
                    <li>Focus on the essential structure needed for further processing</li>
                    <li>Form the basis for code optimization, interpretation, and translation</li>
                    <li>Are typically constructed during or after parsing</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>36. Error Recovery in Parsing</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Error recovery techniques allow parsers to continue after syntax errors:
                  <ul>
                    <li><strong>Panic mode recovery</strong>: Skip input until a synchronizing token is found</li>
                    <li><strong>Phrase level recovery</strong>: Replace, insert, or delete tokens to correct errors</li>
                    <li><strong>Error productions</strong>: Grammar rules that describe common errors</li>
                    <li><strong>Global correction</strong>: Find minimal edit distance to a valid program</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>37. Incremental Parsing</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Incremental parsers reparse only the changed portions of input:
                  <ul>
                    <li>Essential for interactive environments (IDEs, code editors)</li>
                    <li>Reuse previously built parse trees where possible</li>
                    <li>Requires sophisticated data structures to track dependencies</li>
                    <li>May sacrifice some parsing power for speed</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>38. GLR Parsing for Ambiguous Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  Generalized LR (GLR) parsing:
                  <ul>
                    <li>Extends traditional LR parsing to handle any context-free grammar</li>
                    <li>Supports ambiguous grammars by pursuing multiple parsing paths in parallel</li>
                    <li>Produces all possible parse trees for ambiguous input</li>
                    <li>Used in natural language processing and for complex programming languages</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>39. Parsing Expression Grammars (PEGs)</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  PEGs are an alternative to CFGs with important differences:
                  <ul>
                    <li>Use ordered choice instead of unordered alternatives</li>
                    <li>Incorporate lookahead operators directly in the grammar</li>
                    <li>Never ambiguous due to prioritized choice</li>
                    <li>Can be parsed in linear time with packrat parsing</li>
                    <li>Not equivalent to CFGs in expressive power (incomparable)</li>
                  </ul>
                </TooltipText>
              </p>
              
              <TopicTitle>40. Probabilistic Context-Free Grammars</TopicTitle>
              <p>
                <TooltipText moreInfoCallback={handleTermClick}>
                  PCFGs extend CFGs with probabilities for each production rule:
                  <ul>
                    <li>Useful for disambiguation in natural language parsing</li>
                    <li>Support statistical parsing algorithms</li>
                    <li>Enable choosing the most likely parse among alternatives</li>
                    <li>Form the basis for more advanced statistical NLP models</li>
                    <li>Applications in speech recognition and machine translation</li>
                  </ul>
                </TooltipText>
              </p>
            </>
          )}
        </Section>
      </TabContent>
      
      <TabContent active={activeTab === 'glossary'}>
        <div ref={glossaryRef}>
          <Glossary />
        </div>
      </TabContent>
      
      <TabContent active={activeTab === 'interactive'}>
        <InteractiveExamples />
      </TabContent>
      
      <TabContent active={activeTab === 'comparisons'}>
        <VisualComparisons />
      </TabContent>
      
      <TabContent active={activeTab === 'cheatsheet'}>
        <CheatSheet />
      </TabContent>
    </ExplanationContainer>
  );
}

export default Explanation;