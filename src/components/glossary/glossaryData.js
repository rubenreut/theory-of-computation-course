const glossaryData = [
  {
    term: "Terminal",
    category: "Grammar Components",
    definition: "A terminal symbol is a basic building block of a language that cannot be further divided or replaced. These are the actual characters or tokens that appear in the strings of the language. In the formal definition of a grammar G = (V, Σ, R, S), terminals are elements of the set Σ.",
    examples: [
      {
        text: "In a grammar for arithmetic expressions, terminals might include digits (0-9), operators (+, -, *, /), and parentheses.",
      },
      {
        text: "In this example grammar G = (V, Σ, R, S) where:",
        code: "V = {S, A, B}\nΣ = {a, b, c}\nR = {S → AB, A → aA, A → a, B → bB, B → c}\nS is the start symbol"
      },
      {
        text: "The terminals are 'a', 'b', and 'c'. These symbols cannot be replaced by other symbols using the grammar rules."
      }
    ],
    relatedTerms: ["Non-terminal", "Production Rule", "Alphabet"]
  },
  {
    term: "Non-terminal",
    category: "Grammar Components",
    definition: "A non-terminal symbol (also called a variable) is a symbol that can be replaced by other symbols according to the production rules of the grammar. Non-terminals represent syntactic categories or phrase structures in the language. In the formal definition of a grammar G = (V, Σ, R, S), non-terminals are elements of the set V.",
    examples: [
      {
        text: "Common non-terminals in programming language grammars include &lt;expression&gt;, &lt;statement&gt;, and &lt;program&gt;."
      },
      {
        text: "In this example grammar G = (V, Σ, R, S) where:",
        code: "V = {S, A, B}\nΣ = {a, b, c}\nR = {S → AB, A → aA, A → a, B → bB, B → c}\nS is the start symbol"
      },
      {
        text: "The non-terminals are 'S', 'A', and 'B'. These symbols get replaced during derivation, unlike terminals which remain unchanged."
      }
    ],
    relatedTerms: ["Terminal", "Production Rule", "Start Symbol"]
  },
  {
    term: "Production Rule",
    category: "Grammar Components",
    definition: "A production rule (or simply 'production') is a rewriting rule that specifies how symbols in the grammar can be replaced or transformed. Each rule has a left-hand side (LHS) containing a single non-terminal, and a right-hand side (RHS) containing a sequence of terminals and/or non-terminals. Productions define the syntax of the language. In context-free grammars, the LHS must be a single non-terminal symbol.",
    examples: [
      {
        text: "For a grammar that generates palindromes over {a, b}:",
        code: "S → aSa | bSb | a | b | ε"
      },
      {
        text: "This is a single production with multiple alternatives. It says that S can be replaced by 'aSa' or 'bSb' or 'a' or 'b' or the empty string (ε)."
      },
      {
        text: "For a grammar that generates balanced parentheses:",
        code: "S → (S) | SS | ε"
      }
    ],
    relatedTerms: ["Terminal", "Non-terminal", "Context-Free Grammar", "Derivation"]
  },
  {
    term: "Start Symbol",
    category: "Grammar Components",
    definition: "The start symbol (initial symbol) is a distinguished non-terminal symbol from which all derivations begin. It represents the top-level syntactic category of the language. Every string in the language must be derivable from the start symbol through a sequence of production rule applications. In the formal definition of a grammar G = (V, Σ, R, S), 'S' is the start symbol.",
    examples: [
      {
        text: "In a programming language grammar, the start symbol might be 'Program' or 'CompilationUnit'."
      },
      {
        text: "If we have a grammar for arithmetic expressions, the start symbol might be 'Expression':"
      },
      {
        code: "Expression → Term + Expression | Term\nTerm → Factor * Term | Factor\nFactor → (Expression) | Number\nNumber → 0 | 1 | 2 | ... | 9"
      },
      {
        text: "Here, 'Expression' is the start symbol and all valid arithmetic expressions must be derivable from it."
      }
    ],
    relatedTerms: ["Non-terminal", "Production Rule", "Language"]
  },
  {
    term: "Derivation",
    category: "Grammar Concepts",
    definition: "A derivation is a sequence of production rule applications that transforms the start symbol into a string of terminals. It shows the step-by-step process of generating a string in the language. Each step replaces a non-terminal with the right-hand side of a matching production rule.",
    examples: [
      {
        text: "For a grammar with rules S → AB, A → aA | a, B → bB | b, a derivation of 'aabb' would be:"
      },
      {
        code: "S ⇒ AB ⇒ aAB ⇒ aaB ⇒ aabB ⇒ aabb"
      },
      {
        text: "Each step (⇒) represents the application of a production rule to transform one sentential form into another."
      }
    ],
    relatedTerms: ["Leftmost Derivation", "Rightmost Derivation", "Sentential Form", "Parse Tree"]
  },
  {
    term: "Leftmost Derivation",
    category: "Grammar Concepts",
    definition: "A leftmost derivation is a specific type of derivation where, at each step, the leftmost non-terminal in the sentential form is replaced according to a production rule. This strategy ensures a deterministic order of replacements, which is particularly useful for parsing algorithms.",
    examples: [
      {
        text: "For a grammar with rules S → AB, A → aA | a, B → bB | b, a leftmost derivation of 'aabb' would be:"
      },
      {
        code: "S ⇒ AB (replace S, the leftmost non-terminal)\n⇒ aAB (replace A, the leftmost non-terminal)\n⇒ aaB (replace A, the leftmost non-terminal)\n⇒ aabB (replace B, the leftmost non-terminal)\n⇒ aabb (replace B, the leftmost non-terminal)"
      },
      {
        text: "At each step, we always replace the leftmost non-terminal in the current sentential form."
      }
    ],
    relatedTerms: ["Derivation", "Rightmost Derivation", "LL Parsing"]
  },
  {
    term: "Rightmost Derivation",
    category: "Grammar Concepts",
    definition: "A rightmost derivation is a specific type of derivation where, at each step, the rightmost non-terminal in the sentential form is replaced according to a production rule. This approach is often used in bottom-up parsing strategies, including LR parsers.",
    examples: [
      {
        text: "For a grammar with rules S → AB, A → aA | a, B → bB | b, a rightmost derivation of 'aabb' would be:"
      },
      {
        code: "S ⇒ AB (replace S, the only non-terminal)\n⇒ AbB (replace B, the rightmost non-terminal)\n⇒ Abb (replace B, the rightmost non-terminal)\n⇒ aAbb (replace A, the rightmost non-terminal)\n⇒ aabb (replace A, the rightmost non-terminal)"
      },
      {
        text: "At each step, we always replace the rightmost non-terminal in the current sentential form."
      }
    ],
    relatedTerms: ["Derivation", "Leftmost Derivation", "LR Parsing"]
  },
  {
    term: "Sentential Form",
    category: "Grammar Concepts",
    definition: "A sentential form is any string of terminals and non-terminals that can be derived from the start symbol of a grammar. It represents an intermediate step in the derivation process. When a sentential form contains only terminal symbols, it is called a sentence and belongs to the language generated by the grammar.",
    examples: [
      {
        text: "For a grammar with rules S → AB, A → aA | a, B → bB | b:"
      },
      {
        text: "Sentential forms in the derivation of 'aabb' include:"
      },
      {
        code: "S, AB, aAB, aaB, aabB, aabb"
      },
      {
        text: "All of these are sentential forms, but only 'aabb' is a sentence (contains only terminals)."
      }
    ],
    relatedTerms: ["Derivation", "Sentence", "Language"]
  },
  {
    term: "Parse Tree",
    category: "Grammar Concepts",
    definition: "A parse tree (or derivation tree) is a graphical representation of a derivation, showing the hierarchical syntactic structure of a string according to a grammar. The root of the tree is the start symbol, internal nodes are non-terminals, and leaf nodes are terminals. Each internal node and its children represent the application of a production rule.",
    examples: [
      {
        text: "For the string 'aabb' derived from a grammar with rules S → AB, A → aA | a, B → bB | b, the parse tree would look like:"
      },
      {
        code: "    S\n   / \\\n  A   B\n / \\ / \\\na  a b  b"
      },
      {
        text: "This tree shows that 'aabb' is generated by applying S → AB, then A → aA, A → a, B → bB, and B → b."
      }
    ],
    relatedTerms: ["Derivation", "Abstract Syntax Tree", "Ambiguity"]
  },
  {
    term: "Language",
    category: "Formal Language Theory",
    definition: "In the context of formal language theory, a language is a set of strings over a given alphabet. For a context-free grammar G, the language L(G) generated by G is the set of all terminal strings that can be derived from the start symbol of the grammar. Formally, L(G) = {w ∈ Σ* | S ⇒* w}, where ⇒* represents zero or more derivation steps.",
    examples: [
      {
        text: "The language generated by the grammar with rules S → AB, A → aA | a, B → bB | b is the set of all strings of the form a<sup>n</sup>b<sup>m</sup> where n ≥ 1 and m ≥ 1."
      },
      {
        text: "Some strings in this language include: 'ab', 'aab', 'abb', 'aabb', 'aaabb', etc."
      },
      {
        text: "The grammar with rules S → aSb | ε generates the language of all strings of the form a<sup>n</sup>b<sup>n</sup> where n ≥ 0, i.e., {ε, ab, aabb, aaabbb, ...}."
      }
    ],
    relatedTerms: ["Context-Free Language", "Regular Language", "Alphabet"]
  },
  {
    term: "Context-Free Grammar (CFG)",
    category: "Grammar Types",
    definition: "A context-free grammar is a formal grammar where every production rule has a single non-terminal on its left-hand side. Formally, a CFG is defined as a 4-tuple G = (V, Σ, R, S), where V is a set of non-terminals, Σ is a set of terminals, R is a set of production rules of the form A → α where A ∈ V and α ∈ (V ∪ Σ)*, and S ∈ V is the start symbol. CFGs are used to describe the syntax of programming languages, natural languages, and other structured languages.",
    examples: [
      {
        text: "A classic example of a CFG is a grammar for balanced parentheses:"
      },
      {
        code: "S → (S) | SS | ε"
      },
      {
        text: "This grammar generates strings like '', '()', '()()', '((()))', '(()())', etc."
      },
      {
        text: "Another example is a grammar for arithmetic expressions:"
      },
      {
        code: "E → E + T | T\nT → T * F | F\nF → (E) | id"
      },
      {
        text: "This grammar can generate expressions like 'id', 'id+id', 'id*id', '(id+id)*id', etc."
      }
    ],
    relatedTerms: ["Context-Free Language", "Chomsky Hierarchy", "Regular Grammar"]
  },
  {
    term: "Context-Free Language (CFL)",
    category: "Formal Language Theory",
    definition: "A context-free language is a formal language that can be generated by some context-free grammar. CFLs are more expressive than regular languages but less expressive than context-sensitive languages in the Chomsky hierarchy. Context-free languages are precisely those languages that can be recognized by pushdown automata.",
    examples: [
      {
        text: "The language of palindromes over an alphabet {a, b} is a context-free language."
      },
      {
        text: "The language L = {a<sup>n</sup>b<sup>n</sup> | n ≥ 0} (equal numbers of a's followed by b's) is a context-free language."
      },
      {
        text: "The language L = {a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 0} (equal numbers of a's, b's, and c's) is NOT a context-free language."
      }
    ],
    relatedTerms: ["Context-Free Grammar", "Pushdown Automaton", "Pumping Lemma"]
  },
  {
    term: "Chomsky Normal Form (CNF)",
    category: "Grammar Forms",
    definition: "Chomsky Normal Form is a standardized form for context-free grammars where all production rules have one of the following forms: A → BC (where B and C are non-terminals) or A → a (where a is a terminal) or S → ε (where S is the start symbol and doesn't appear on the right side of any production). Every context-free grammar can be converted to an equivalent grammar in CNF. CNF is particularly useful for parsing algorithms like the CYK algorithm.",
    examples: [
      {
        text: "Consider a grammar with the rule S → aSb | ε"
      },
      {
        text: "Converted to CNF, this would become:"
      },
      {
        code: "S → AB | ε\nA → a\nB → Sb\nB → b"
      },
      {
        text: "Notice that every production now has either two non-terminals or a single terminal on the right-hand side."
      }
    ],
    relatedTerms: ["Greibach Normal Form", "CYK Algorithm", "Grammar Transformation"]
  },
  {
    term: "Greibach Normal Form (GNF)",
    category: "Grammar Forms",
    definition: "Greibach Normal Form is a standardized form for context-free grammars where every production rule has the form A → aα, where A is a non-terminal, a is a terminal, and α is a (possibly empty) string of non-terminals. In other words, the right-hand side of each rule starts with exactly one terminal followed by zero or more non-terminals. Every context-free grammar without ε-productions can be converted to an equivalent grammar in GNF.",
    examples: [
      {
        text: "Consider a grammar with rules S → AB, A → aA | a, B → bB | b"
      },
      {
        text: "Converted to GNF, this could become:"
      },
      {
        code: "S → aS₁ | a\nS₁ → aS₁B | aB\nB → bB | b"
      },
      {
        text: "Note that each right-hand side starts with exactly one terminal symbol."
      }
    ],
    relatedTerms: ["Chomsky Normal Form", "Grammar Transformation"]
  },
  {
    term: "CYK Algorithm",
    category: "Parsing Algorithms",
    definition: "The CYK (Cocke-Younger-Kasami) algorithm is a dynamic programming algorithm for determining whether a string can be derived from a context-free grammar. It requires the grammar to be in Chomsky Normal Form. The algorithm constructs a parsing table bottom-up and has a time complexity of O(n³), where n is the length of the input string. CYK can be extended to produce all possible parse trees for ambiguous grammars.",
    examples: [
      {
        text: "For a grammar in CNF and the input string 'aabb', the CYK algorithm would build a triangular parsing table where each cell [i,j] contains the set of non-terminals that can derive the substring from position i to position j."
      },
      {
        text: "If the start symbol appears in the cell [0,n-1] (top-right cell of the table), the string is accepted by the grammar."
      }
    ],
    relatedTerms: ["Chomsky Normal Form", "Dynamic Programming", "Parsing"]
  },
  {
    term: "Earley Parser",
    category: "Parsing Algorithms",
    definition: "The Earley parser is a chart parsing algorithm for context-free grammars that combines elements of top-down and bottom-up parsing. It can handle any context-free grammar, including ambiguous ones, without requiring grammar transformations. The algorithm constructs a set of states (items) for each position in the input string and has a worst-case time complexity of O(n³), but can be O(n²) for unambiguous grammars and O(n) for certain grammar classes.",
    examples: [
      {
        text: "An Earley item has the form [A → α•β, i], meaning we're trying to find a production A → αβ, we've already recognized α starting from position i, and we're looking for β next."
      },
      {
        text: "The algorithm builds sets of items S₀, S₁, ..., Sₙ for input of length n, using prediction, scanning, and completion operations."
      }
    ],
    relatedTerms: ["CYK Algorithm", "Chart Parsing", "Recursive Descent Parsing"]
  },
  {
    term: "Ambiguity",
    category: "Grammar Properties",
    definition: "A context-free grammar is ambiguous if there exists at least one string in the language that has more than one distinct parse tree (or equivalently, more than one leftmost or rightmost derivation). Ambiguity is often undesirable in programming language grammars as it leads to parsing conflicts and potential misinterpretations of code.",
    examples: [
      {
        text: "The classic example of ambiguity is the 'dangling else' problem in programming languages:"
      },
      {
        code: "if-stmt → if condition then stmt | if condition then stmt else stmt"
      },
      {
        text: "For a statement like 'if C1 then if C2 then S1 else S2', it's ambiguous whether the 'else' belongs to the first or second 'if'."
      },
      {
        text: "Another example is an ambiguous expression grammar:"
      },
      {
        code: "E → E + E | E * E | id"
      },
      {
        text: "For an expression like 'id + id * id', there are two different parse trees corresponding to (id + id) * id or id + (id * id)."
      }
    ],
    relatedTerms: ["Parse Tree", "Precedence", "Associativity"]
  },
  {
    term: "LL Parsing",
    category: "Parsing Techniques",
    definition: "LL parsing is a top-down parsing method for context-free grammars that builds a leftmost derivation. The name 'LL' means scanning the input from Left to right while constructing a Leftmost derivation. LL(k) parsers use k tokens of lookahead to make parsing decisions. LL(1) parsers are particularly common and can be implemented using a parsing table that maps non-terminal and lookahead token pairs to production rules.",
    examples: [
      {
        text: "For an LL(1) grammar, we construct a parsing table where each entry [A,a] contains the production to use when non-terminal A is on top of the stack and token a is the next input."
      },
      {
        text: "For example, with grammar S → aAB, A → aA | ε, B → b, an LL(1) table might have entries like [S,a] = S → aAB, [A,a] = A → aA, [A,b] = A → ε, etc."
      }
    ],
    relatedTerms: ["Recursive Descent Parsing", "Predictive Parsing", "First and Follow Sets"]
  },
  {
    term: "LR Parsing",
    category: "Parsing Techniques",
    definition: "LR parsing is a bottom-up parsing method for context-free grammars that builds a rightmost derivation in reverse. The name 'LR' means scanning the input from Left to right while constructing a Rightmost derivation in reverse. LR parsers use shift-reduce parsing with a stack and can handle a larger class of grammars than LL parsers. Common variants include LR(0), SLR(1), LALR(1), and canonical LR(1), in order of increasing power.",
    examples: [
      {
        text: "An LR parser uses two tables: an action table to decide whether to shift an input token onto the stack or reduce by a grammar rule, and a goto table to determine the next state after a reduction."
      },
      {
        text: "For example, when parsing 'id + id * id' with an LR grammar for expressions, the parser might shift 'id', reduce to E, shift '+', shift 'id', reduce to E, shift '*', shift 'id', reduce to E, reduce E * E to E, and finally reduce E + E to E."
      }
    ],
    relatedTerms: ["Bottom-up Parsing", "Shift-Reduce Parsing", "GLR Parsing"]
  },
  {
    term: "First and Follow Sets",
    category: "Parsing Theory",
    definition: "First and Follow sets are important concepts used in predictive parsing, particularly for constructing LL(1) parsing tables. For a grammar symbol X: <ul><li>FIRST(X) is the set of terminals that can appear as the first symbol of any string derived from X</li><li>FOLLOW(X) is the set of terminals that can appear immediately after X in any sentential form derived from the start symbol</li></ul> These sets help determine which production to use when faced with multiple alternatives during top-down parsing.",
    examples: [
      {
        text: "For a grammar with rules S → AB, A → aA | ε, B → b:"
      },
      {
        text: "FIRST(S) = {a, b} (since A can derive ε, we include FIRST(B))"
      },
      {
        text: "FIRST(A) = {a, ε}"
      },
      {
        text: "FIRST(B) = {b}"
      },
      {
        text: "FOLLOW(S) = {$} ($ is the end-of-input marker)"
      },
      {
        text: "FOLLOW(A) = {b} (because B follows A in S → AB and FIRST(B) = {b})"
      },
      {
        text: "FOLLOW(B) = {$} (because B can appear at the end of a derivation from S)"
      }
    ],
    relatedTerms: ["LL Parsing", "Predictive Parsing", "Parsing Table"]
  },
  {
    term: "Chomsky Hierarchy",
    category: "Formal Language Theory",
    definition: "The Chomsky hierarchy is a classification of formal grammars and their corresponding languages into four types, based on increasing generative power. The hierarchy consists of: <ol><li>Type 3: Regular grammars/languages (recognized by finite automata)</li><li>Type 2: Context-free grammars/languages (recognized by pushdown automata)</li><li>Type 1: Context-sensitive grammars/languages (recognized by linear bounded automata)</li><li>Type 0: Unrestricted grammars/languages (recognized by Turing machines)</li></ol> Each type is a proper subset of the types above it, meaning every regular language is context-free, every context-free language is context-sensitive, and so on.",
    examples: [
      {
        text: "Regular languages include simple patterns like a*b* (any number of a's followed by any number of b's)."
      },
      {
        text: "Context-free languages include nested structures like balanced parentheses or a^n b^n (equal numbers of a's and b's)."
      },
      {
        text: "Context-sensitive languages include patterns like a^n b^n c^n (equal numbers of a's, b's, and c's)."
      },
      {
        text: "Unrestricted languages include any computationally recognizable language."
      }
    ],
    relatedTerms: ["Regular Grammar", "Context-Free Grammar", "Context-Sensitive Grammar"]
  },
  {
    term: "Pumping Lemma",
    category: "Language Properties",
    definition: "The pumping lemma for context-free languages is a property that all context-free languages must satisfy. It states that for any context-free language L, there exists a pumping length p > 0 such that any string s in L with |s| ≥ p can be divided into five parts s = uvxyz, satisfying: <ol><li>|vy| > 0 (v and y cannot both be empty)</li><li>|vxy| ≤ p (the middle portion is not too long)</li><li>For all i ≥ 0, uv<sup>i</sup>xy<sup>i</sup>z is in L</li></ol> The pumping lemma is primarily used to prove that certain languages are not context-free, through proof by contradiction.",
    examples: [
      {
        text: "To prove that L = {a^n b^n c^n | n ≥ 1} is not context-free, we assume it is and apply the pumping lemma to the string s = a^p b^p c^p (where p is the pumping length)."
      },
      {
        text: "No matter how we divide s into uvxyz satisfying the conditions, pumping v and y (i.e., replacing s with uv^2xy^2z) will produce a string that is not in L, contradicting the pumping lemma."
      },
      {
        text: "For example, if v contains only a's and y contains only b's, then uv^2xy^2z would have more a's than c's, which is not in L."
      }
    ],
    relatedTerms: ["Context-Free Language", "Language Properties", "Closure Properties"]
  },
  {
    term: "Pushdown Automaton (PDA)",
    category: "Automata Theory",
    definition: "A pushdown automaton is a computational model that extends a finite automaton with a stack, allowing it to recognize context-free languages. Formally, a PDA is defined as a 7-tuple (Q, Σ, Γ, δ, q₀, Z₀, F), where Q is a set of states, Σ is the input alphabet, Γ is the stack alphabet, δ is the transition function, q₀ is the initial state, Z₀ is the initial stack symbol, and F is the set of accepting states. The key feature of a PDA is its ability to push and pop symbols from the stack, enabling it to keep track of nested structures.",
    examples: [
      {
        text: "A PDA for recognizing the language L = {a^n b^n | n ≥ 0} can be constructed as follows:"
      },
      {
        text: "1. Push a symbol onto the stack for each 'a' read"
      },
      {
        text: "2. Pop a symbol from the stack for each 'b' read"
      },
      {
        text: "3. Accept if the stack is empty at the end"
      },
      {
        text: "This PDA can recognize strings like '', 'ab', 'aabb', 'aaabbb', etc."
      }
    ],
    relatedTerms: ["Context-Free Language", "Deterministic PDA", "Finite Automaton"]
  },
  {
    term: "Regular Grammar",
    category: "Grammar Types",
    definition: "A regular grammar is a context-free grammar where all production rules have one of the following forms: A → aB, A → a, or A → ε (where A, B are non-terminals and a is a terminal). Regular grammars are equivalent in power to finite automata and can generate exactly the regular languages. They form Type 3 in the Chomsky hierarchy and are less expressive than context-free grammars.",
    examples: [
      {
        text: "A regular grammar for strings ending with 'ab':"
      },
      {
        code: "S → aS | bS | aA\nA → bB\nB → ε"
      },
      {
        text: "This grammar generates strings like 'ab', 'aab', 'abab', 'bbbab', etc."
      },
      {
        text: "Regular grammars cannot describe nested or recursive structures like balanced parentheses or a^n b^n."
      }
    ],
    relatedTerms: ["Context-Free Grammar", "Regular Language", "Finite Automaton"]
  },
  {
    term: "Left Recursion",
    category: "Grammar Properties",
    definition: "Left recursion occurs in a context-free grammar when a non-terminal appears as the leftmost symbol in the right-hand side of its own production rule, either directly (immediate left recursion) or indirectly through a series of derivations. Left-recursive grammars cannot be directly parsed by recursive descent parsers or LL parsers, as they would lead to infinite recursion.",
    examples: [
      {
        text: "Direct left recursion:"
      },
      {
        code: "A → Aα | β"
      },
      {
        text: "Here, A directly refers to itself at the leftmost position."
      },
      {
        text: "Indirect left recursion:"
      },
      {
        code: "A → Bα\nB → Cβ\nC → Aγ"
      },
      {
        text: "Here, A derives B, which derives C, which derives A again, forming a cycle."
      },
      {
        text: "Left recursion can be eliminated by transforming the grammar. For A → Aα | β, we can rewrite it as:"
      },
      {
        code: "A → βA'\nA' → αA' | ε"
      }
    ],
    relatedTerms: ["Recursive Descent Parsing", "LL Parsing", "Grammar Transformation"]
  },
  {
    term: "Abstract Syntax Tree (AST)",
    category: "Compiler Theory",
    definition: "An abstract syntax tree is a tree representation of the syntactic structure of source code, simplified from a parse tree by removing nodes that don't contribute to the program's semantics. ASTs represent the abstract syntactic structure rather than the concrete syntax. They are widely used in compilers, interpreters, and static analysis tools as an intermediate representation between the parse tree and further processing stages.",
    examples: [
      {
        text: "For the arithmetic expression '2 * (3 + 4)', a parse tree would include nodes for every token and grammar rule, while an AST might look like:"
      },
      {
        code: "    *\n   / \\\n  2   +\n     / \\\n    3   4"
      },
      {
        text: "This AST focuses on the operations (multiplication and addition) and their operands, omitting details like parentheses that don't affect the computation."
      }
    ],
    relatedTerms: ["Parse Tree", "Compiler", "Code Generation"]
  },
  {
    term: "ε-Production",
    category: "Grammar Features",
    definition: "An ε-production (epsilon production) is a context-free grammar rule that has the empty string (ε) as its right-hand side. Such a rule allows a non-terminal to derive the empty string, effectively disappearing from the sentential form. ε-productions are useful for representing optional elements in a language but can complicate parsing.",
    examples: [
      {
        text: "In a grammar for if-then-else statements with an optional else clause:"
      },
      {
        code: "if-stmt → if condition then stmt else-part\nelse-part → else stmt | ε"
      },
      {
        text: "The rule 'else-part → ε' allows for if statements without an else clause."
      },
      {
        text: "Another example is in a grammar for balanced parentheses:"
      },
      {
        code: "S → (S) | SS | ε"
      },
      {
        text: "The rule 'S → ε' allows for the empty string as a valid balanced parenthesis expression."
      }
    ],
    relatedTerms: ["Nullable Symbol", "Grammar Transformation", "Chomsky Normal Form"]
  },
  {
    term: "Nullable Symbol",
    category: "Grammar Features",
    definition: "A nullable symbol in a context-free grammar is a non-terminal that can derive the empty string (ε) through a sequence of production rules. A non-terminal is nullable if it has an ε-production or if it can derive a string of nullable non-terminals. Identifying nullable symbols is an important step in many grammar transformations and parsing algorithms.",
    examples: [
      {
        text: "For a grammar with rules:"
      },
      {
        code: "S → AB | a\nA → CD | ε\nB → b | ε\nC → c | ε\nD → d"
      },
      {
        text: "The nullable symbols are A, B, and C (directly or indirectly derive ε). S is not nullable because both of its alternatives contain at least one non-nullable symbol."
      }
    ],
    relatedTerms: ["ε-Production", "Grammar Transformation", "First Set"]
  },
  {
    term: "Unit Production",
    category: "Grammar Features",
    definition: "A unit production (or chain production) is a context-free grammar rule where the right-hand side consists of a single non-terminal symbol. Unit productions of the form A → B create chains of non-terminals without adding terminal symbols to the derived string. While sometimes convenient for grammar clarity, unit productions can be eliminated by grammar transformations without changing the language generated.",
    examples: [
      {
        text: "In a grammar with rules:"
      },
      {
        code: "S → A | a\nA → B\nB → b"
      },
      {
        text: "The rule 'A → B' is a unit production. It can be eliminated by replacing A with B's right-hand sides:"
      },
      {
        code: "S → A | a\nA → b\nB → b"
      },
      {
        text: "And further simplifying:"
      },
      {
        code: "S → A | a\nA → b"
      }
    ],
    relatedTerms: ["Grammar Transformation", "Chomsky Normal Form"]
  },
  {
    term: "Derivation Tree",
    category: "Grammar Concepts",
    definition: "A derivation tree, also known as a parse tree, is a graphical representation of the derivation process for a string according to a context-free grammar. It visualizes the hierarchical syntactic structure of the string. In a derivation tree, the root is the start symbol, internal nodes are non-terminals, leaf nodes form the derived string when read from left to right, and each internal node with its immediate children represents the application of a production rule.",
    examples: [
      {
        text: "For the string 'aabb' derived from the grammar S → AB, A → aA | a, B → bB | b, the derivation tree would be:"
      },
      {
        code: "    S\n   / \\\n  A   B\n / \\ / \\\na  a b  b"
      },
      {
        text: "This tree shows how 'aabb' is derived: S derives AB, A derives aa (through a chain of derivations), and B derives bb."
      }
    ],
    relatedTerms: ["Parse Tree", "Derivation", "Abstract Syntax Tree"]
  }
];

export default glossaryData;