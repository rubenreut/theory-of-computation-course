import React from 'react';
import styled from 'styled-components';

const CheatSheetContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  margin-top: 0;
  display: flex;
  align-items: center;
`;

const TitleIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2em;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const CheatSheetContent = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #444;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const Formula = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const FormulaTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const FormulaContent = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #43A047;
  }
  
  svg {
    margin-right: 8px;
  }
`;

function CheatSheet() {
  const handleDownload = () => {
    // Create the content of the cheat sheet as text
    const content = `CONTEXT-FREE GRAMMARS CHEAT SHEET
=================================

FORMAL DEFINITION
----------------
A context-free grammar G is defined as a 4-tuple G = (V, Σ, R, S), where:
- V: a finite set of non-terminal symbols
- Σ: a finite set of terminal symbols (disjoint from V)
- R: a finite set of production rules of the form A → α, where A ∈ V and α ∈ (V ∪ Σ)*
- S: the start symbol (S ∈ V)

KEY CONCEPTS
-----------
- Terminal: A symbol that cannot be replaced; appears in the final strings
- Non-terminal: A variable that can be replaced by other symbols
- Production rule: A rewriting rule specifying how symbols can be transformed
- Start symbol: The non-terminal from which all derivations begin
- Derivation: A sequence of rule applications transforming the start symbol to a string
- Sentential form: Any string of terminals and non-terminals derivable from the start symbol
- Sentence: A sentential form containing only terminal symbols

GRAMMAR FORMS
------------
Chomsky Normal Form (CNF):
- Every production is of the form:
  * A → BC (where A, B, C are non-terminals)
  * A → a (where A is a non-terminal and a is a terminal)
  * S → ε (only if S is the start symbol)

Greibach Normal Form (GNF):
- Every production is of the form:
  * A → aα (where A is a non-terminal, a is a terminal, and α is a string of non-terminals)

GRAMMAR CLASSIFICATIONS
---------------------
- LL(k) Grammar: Can be parsed by a top-down parser with k tokens of lookahead
- LR(k) Grammar: Can be parsed by a bottom-up parser with k tokens of lookahead
- Ambiguous Grammar: At least one string has multiple distinct parse trees
- Unambiguous Grammar: Every string has exactly one parse tree

PARSING ALGORITHMS
----------------
1. CYK Algorithm:
   - Works with grammars in CNF
   - Bottom-up dynamic programming approach
   - O(n³) time complexity

2. Recursive Descent Parsing:
   - Top-down approach
   - Each non-terminal implemented as a function
   - Cannot handle left recursion directly

3. LL(1) Parsing:
   - Top-down with one token lookahead
   - Uses FIRST and FOLLOW sets
   - Needs predictive parsing table

4. LR Parsing:
   - Bottom-up approach
   - Uses shift-reduce parsing with a stack
   - Variants: LR(0), SLR(1), LALR(1), LR(1)

FIRST AND FOLLOW SETS
-------------------
FIRST(X):
- If X is a terminal: FIRST(X) = {X}
- If X is a non-terminal with rule X → ε: ε ∈ FIRST(X)
- If X → Y1Y2...Yn:
  * Add FIRST(Y1) - {ε} to FIRST(X)
  * If Y1 can derive ε, add FIRST(Y2) - {ε} to FIRST(X), and so on

FOLLOW(A) for non-terminal A:
- If A is the start symbol: $ ∈ FOLLOW(A)
- If B → αAβ is a production:
  * Add FIRST(β) - {ε} to FOLLOW(A)
  * If β can derive ε or β = ε, add FOLLOW(B) to FOLLOW(A)

COMMON TRANSFORMATIONS
--------------------
1. Eliminating ε-productions:
   - Find all nullable non-terminals
   - For each production with nullable symbols, add new productions representing all combinations
   - Remove original ε-productions

2. Eliminating unit productions:
   - Compute unit pairs (A,B)
   - For each (A,B) and B → γ (non-unit), add A → γ
   - Remove all unit productions

3. Converting to CNF:
   - Eliminate ε-productions
   - Eliminate unit productions
   - Replace terminals in mixed rules
   - Break long right-hand sides

CLOSURE PROPERTIES OF CFLs
------------------------
Context-free languages are closed under:
- Union
- Concatenation
- Kleene star
- Substitution
- Homomorphism
- Inverse homomorphism
- Intersection with regular languages

Context-free languages are NOT closed under:
- Intersection
- Complement
- Difference

PUMPING LEMMA
------------
For any context-free language L, there exists a pumping length p such that any string s in L with |s| ≥ p can be divided into five parts s = uvxyz such that:
1. |vy| > 0
2. |vxy| ≤ p
3. For all i ≥ 0, uv^i xy^i z is in L

Used to prove certain languages are not context-free.

Generated with Context-Free Grammar Learning App
`;

    // Create a blob from the text content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cfg_cheat_sheet.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <CheatSheetContainer>
      <Title>
        <TitleIcon>📝</TitleIcon>
        Context-Free Grammars Cheat Sheet
      </Title>
      
      <Description>
        A comprehensive reference guide covering the most important concepts, definitions, and algorithms 
        related to context-free grammars. Use this as a quick reference while studying or solving problems.
      </Description>
      
      <CheatSheetContent>
        <Section>
          <SectionTitle>Formal Definition</SectionTitle>
          <p>A context-free grammar G is defined as a 4-tuple G = (V, Σ, R, S), where:</p>
          <ul>
            <li><strong>V</strong>: a finite set of non-terminal symbols</li>
            <li><strong>Σ</strong>: a finite set of terminal symbols (disjoint from V)</li>
            <li><strong>R</strong>: a finite set of production rules of the form A → α, where A ∈ V and α ∈ (V ∪ Σ)*</li>
            <li><strong>S</strong>: the start symbol (S ∈ V)</li>
          </ul>
        </Section>
        
        <Section>
          <SectionTitle>Grammar Forms</SectionTitle>
          <Grid>
            <Formula>
              <FormulaTitle>Chomsky Normal Form</FormulaTitle>
              <FormulaContent>
                A → BC (non-terminals only)
                A → a (single terminal)
                S → ε (only for start symbol)
              </FormulaContent>
            </Formula>
            
            <Formula>
              <FormulaTitle>Greibach Normal Form</FormulaTitle>
              <FormulaContent>
                A → aα 
                (terminal followed by non-terminals)
              </FormulaContent>
            </Formula>
          </Grid>
        </Section>
        
        <Section>
          <SectionTitle>Parsing Algorithms</SectionTitle>
          <Grid>
            <div>
              <h4>Top-Down Parsing</h4>
              <ul>
                <li><strong>Recursive Descent</strong>: Each non-terminal as a function</li>
                <li><strong>LL(1) Parsing</strong>: Left-to-right, Leftmost derivation, 1 token lookahead</li>
                <li>Uses FIRST and FOLLOW sets</li>
                <li>Cannot handle left recursion directly</li>
              </ul>
            </div>
            
            <div>
              <h4>Bottom-Up Parsing</h4>
              <ul>
                <li><strong>LR Parsing</strong>: Left-to-right, Rightmost derivation in reverse</li>
                <li>Variants: LR(0), SLR(1), LALR(1), LR(1)</li>
                <li>Shift-reduce with action and goto tables</li>
                <li>More powerful but more complex</li>
              </ul>
            </div>
            
            <div>
              <h4>CYK Algorithm</h4>
              <ul>
                <li>Dynamic programming approach</li>
                <li>O(n³) time complexity</li>
                <li>Requires grammar in Chomsky Normal Form</li>
                <li>Builds parsing table bottom-up</li>
              </ul>
            </div>
            
            <div>
              <h4>Earley Parser</h4>
              <ul>
                <li>Chart parsing algorithm</li>
                <li>Works with any context-free grammar</li>
                <li>O(n³) worst case, O(n²) for unambiguous</li>
                <li>No grammar transformation needed</li>
              </ul>
            </div>
          </Grid>
        </Section>
        
        <Section>
          <SectionTitle>FIRST and FOLLOW Sets</SectionTitle>
          <Grid>
            <Formula>
              <FormulaTitle>FIRST</FormulaTitle>
              <FormulaContent>
              
              </FormulaContent>
            </Formula>
            
            <Formula>
              <FormulaTitle>FOLLOW(A) Rules:</FormulaTitle>
              <FormulaContent>

              </FormulaContent>
            </Formula>
          </Grid>
        </Section>
        
        <Section>
          <SectionTitle>Pumping Lemma for CFLs</SectionTitle>

        </Section>
      </CheatSheetContent>
      
      <DownloadButton onClick={handleDownload}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z" />
          <path d="M14 13v1H2v-1h12z" />
        </svg>
        Download Cheat Sheet
      </DownloadButton>
    </CheatSheetContainer>
  );
}

export default CheatSheet;