import {
  require_core
} from "./chunk-3SVWYVNJ.js";
import {
  __commonJS,
  __toESM
} from "./chunk-G3PMV62Z.js";

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/xml.js
var require_xml = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/xml.js"(exports, module) {
    function xml(hljs) {
      const regex = hljs.regex;
      const TAG_NAME_RE = regex.concat(/[A-Z_]/, regex.optional(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/);
      const XML_IDENT_RE = /[A-Za-z0-9._:-]+/;
      const XML_ENTITIES = {
        className: "symbol",
        begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
      };
      const XML_META_KEYWORDS = {
        begin: /\s/,
        contains: [
          {
            className: "keyword",
            begin: /#?[a-z_][a-z1-9_-]+/,
            illegal: /\n/
          }
        ]
      };
      const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
        begin: /\(/,
        end: /\)/
      });
      const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, {
        className: "string"
      });
      const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, {
        className: "string"
      });
      const TAG_INTERNALS = {
        endsWithParent: true,
        illegal: /</,
        relevance: 0,
        contains: [
          {
            className: "attr",
            begin: XML_IDENT_RE,
            relevance: 0
          },
          {
            begin: /=\s*/,
            relevance: 0,
            contains: [
              {
                className: "string",
                endsParent: true,
                variants: [
                  {
                    begin: /"/,
                    end: /"/,
                    contains: [XML_ENTITIES]
                  },
                  {
                    begin: /'/,
                    end: /'/,
                    contains: [XML_ENTITIES]
                  },
                  {
                    begin: /[^\s"'=<>`]+/
                  }
                ]
              }
            ]
          }
        ]
      };
      return {
        name: "HTML, XML",
        aliases: [
          "html",
          "xhtml",
          "rss",
          "atom",
          "xjb",
          "xsd",
          "xsl",
          "plist",
          "wsf",
          "svg"
        ],
        case_insensitive: true,
        contains: [
          {
            className: "meta",
            begin: /<![a-z]/,
            end: />/,
            relevance: 10,
            contains: [
              XML_META_KEYWORDS,
              QUOTE_META_STRING_MODE,
              APOS_META_STRING_MODE,
              XML_META_PAR_KEYWORDS,
              {
                begin: /\[/,
                end: /\]/,
                contains: [
                  {
                    className: "meta",
                    begin: /<![a-z]/,
                    end: />/,
                    contains: [
                      XML_META_KEYWORDS,
                      XML_META_PAR_KEYWORDS,
                      QUOTE_META_STRING_MODE,
                      APOS_META_STRING_MODE
                    ]
                  }
                ]
              }
            ]
          },
          hljs.COMMENT(
            /<!--/,
            /-->/,
            {
              relevance: 10
            }
          ),
          {
            begin: /<!\[CDATA\[/,
            end: /\]\]>/,
            relevance: 10
          },
          XML_ENTITIES,
          {
            className: "meta",
            begin: /<\?xml/,
            end: /\?>/,
            relevance: 10
          },
          {
            className: "tag",
            /*
            The lookahead pattern (?=...) ensures that 'begin' only matches
            '<style' as a single word, followed by a whitespace or an
            ending bracket.
            */
            begin: /<style(?=\s|>)/,
            end: />/,
            keywords: {
              name: "style"
            },
            contains: [TAG_INTERNALS],
            starts: {
              end: /<\/style>/,
              returnEnd: true,
              subLanguage: [
                "css",
                "xml"
              ]
            }
          },
          {
            className: "tag",
            // See the comment in the <style tag about the lookahead pattern
            begin: /<script(?=\s|>)/,
            end: />/,
            keywords: {
              name: "script"
            },
            contains: [TAG_INTERNALS],
            starts: {
              end: /<\/script>/,
              returnEnd: true,
              subLanguage: [
                "javascript",
                "handlebars",
                "xml"
              ]
            }
          },
          // we need this for now for jSX
          {
            className: "tag",
            begin: /<>|<\/>/
          },
          // open tag
          {
            className: "tag",
            begin: regex.concat(
              /</,
              regex.lookahead(regex.concat(
                TAG_NAME_RE,
                // <tag/>
                // <tag>
                // <tag ...
                regex.either(/\/>/, />/, /\s/)
              ))
            ),
            end: /\/?>/,
            contains: [
              {
                className: "name",
                begin: TAG_NAME_RE,
                relevance: 0,
                starts: TAG_INTERNALS
              }
            ]
          },
          // close tag
          {
            className: "tag",
            begin: regex.concat(
              /<\//,
              regex.lookahead(regex.concat(
                TAG_NAME_RE,
                />/
              ))
            ),
            contains: [
              {
                className: "name",
                begin: TAG_NAME_RE,
                relevance: 0
              },
              {
                begin: />/,
                relevance: 0,
                endsParent: true
              }
            ]
          }
        ]
      };
    }
    module.exports = xml;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/bash.js
var require_bash = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/bash.js"(exports, module) {
    function bash(hljs) {
      const regex = hljs.regex;
      const VAR = {};
      const BRACED_VAR = {
        begin: /\$\{/,
        end: /\}/,
        contains: [
          "self",
          {
            begin: /:-/,
            contains: [VAR]
          }
          // default values
        ]
      };
      Object.assign(VAR, {
        className: "variable",
        variants: [
          { begin: regex.concat(
            /\$[\w\d#@][\w\d_]*/,
            // negative look-ahead tries to avoid matching patterns that are not
            // Perl at all like $ident$, @ident@, etc.
            `(?![\\w\\d])(?![$])`
          ) },
          BRACED_VAR
        ]
      });
      const SUBST = {
        className: "subst",
        begin: /\$\(/,
        end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      };
      const HERE_DOC = {
        begin: /<<-?\s*(?=\w+)/,
        starts: {
          contains: [
            hljs.END_SAME_AS_BEGIN({
              begin: /(\w+)/,
              end: /(\w+)/,
              className: "string"
            })
          ]
        }
      };
      const QUOTE_STRING = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          VAR,
          SUBST
        ]
      };
      SUBST.contains.push(QUOTE_STRING);
      const ESCAPED_QUOTE = {
        className: "",
        begin: /\\"/
      };
      const APOS_STRING = {
        className: "string",
        begin: /'/,
        end: /'/
      };
      const ARITHMETIC = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [
          { begin: /\d+#[0-9a-f]+/, className: "number" },
          hljs.NUMBER_MODE,
          VAR
        ]
      };
      const SH_LIKE_SHELLS = [
        "fish",
        "bash",
        "zsh",
        "sh",
        "csh",
        "ksh",
        "tcsh",
        "dash",
        "scsh"
      ];
      const KNOWN_SHEBANG = hljs.SHEBANG({
        binary: `(${SH_LIKE_SHELLS.join("|")})`,
        relevance: 10
      });
      const FUNCTION = {
        className: "function",
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
        relevance: 0
      };
      const KEYWORDS = [
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "while",
        "in",
        "do",
        "done",
        "case",
        "esac",
        "function"
      ];
      const LITERALS = [
        "true",
        "false"
      ];
      const PATH_MODE = {
        match: /(\/[a-z._-]+)+/
      };
      const SHELL_BUILT_INS = [
        "break",
        "cd",
        "continue",
        "eval",
        "exec",
        "exit",
        "export",
        "getopts",
        "hash",
        "pwd",
        "readonly",
        "return",
        "shift",
        "test",
        "times",
        "trap",
        "umask",
        "unset"
      ];
      const BASH_BUILT_INS = [
        "alias",
        "bind",
        "builtin",
        "caller",
        "command",
        "declare",
        "echo",
        "enable",
        "help",
        "let",
        "local",
        "logout",
        "mapfile",
        "printf",
        "read",
        "readarray",
        "source",
        "type",
        "typeset",
        "ulimit",
        "unalias"
      ];
      const ZSH_BUILT_INS = [
        "autoload",
        "bg",
        "bindkey",
        "bye",
        "cap",
        "chdir",
        "clone",
        "comparguments",
        "compcall",
        "compctl",
        "compdescribe",
        "compfiles",
        "compgroups",
        "compquote",
        "comptags",
        "comptry",
        "compvalues",
        "dirs",
        "disable",
        "disown",
        "echotc",
        "echoti",
        "emulate",
        "fc",
        "fg",
        "float",
        "functions",
        "getcap",
        "getln",
        "history",
        "integer",
        "jobs",
        "kill",
        "limit",
        "log",
        "noglob",
        "popd",
        "print",
        "pushd",
        "pushln",
        "rehash",
        "sched",
        "setcap",
        "setopt",
        "stat",
        "suspend",
        "ttyctl",
        "unfunction",
        "unhash",
        "unlimit",
        "unsetopt",
        "vared",
        "wait",
        "whence",
        "where",
        "which",
        "zcompile",
        "zformat",
        "zftp",
        "zle",
        "zmodload",
        "zparseopts",
        "zprof",
        "zpty",
        "zregexparse",
        "zsocket",
        "zstyle",
        "ztcp"
      ];
      const GNU_CORE_UTILS = [
        "chcon",
        "chgrp",
        "chown",
        "chmod",
        "cp",
        "dd",
        "df",
        "dir",
        "dircolors",
        "ln",
        "ls",
        "mkdir",
        "mkfifo",
        "mknod",
        "mktemp",
        "mv",
        "realpath",
        "rm",
        "rmdir",
        "shred",
        "sync",
        "touch",
        "truncate",
        "vdir",
        "b2sum",
        "base32",
        "base64",
        "cat",
        "cksum",
        "comm",
        "csplit",
        "cut",
        "expand",
        "fmt",
        "fold",
        "head",
        "join",
        "md5sum",
        "nl",
        "numfmt",
        "od",
        "paste",
        "ptx",
        "pr",
        "sha1sum",
        "sha224sum",
        "sha256sum",
        "sha384sum",
        "sha512sum",
        "shuf",
        "sort",
        "split",
        "sum",
        "tac",
        "tail",
        "tr",
        "tsort",
        "unexpand",
        "uniq",
        "wc",
        "arch",
        "basename",
        "chroot",
        "date",
        "dirname",
        "du",
        "echo",
        "env",
        "expr",
        "factor",
        // "false", // keyword literal already
        "groups",
        "hostid",
        "id",
        "link",
        "logname",
        "nice",
        "nohup",
        "nproc",
        "pathchk",
        "pinky",
        "printenv",
        "printf",
        "pwd",
        "readlink",
        "runcon",
        "seq",
        "sleep",
        "stat",
        "stdbuf",
        "stty",
        "tee",
        "test",
        "timeout",
        // "true", // keyword literal already
        "tty",
        "uname",
        "unlink",
        "uptime",
        "users",
        "who",
        "whoami",
        "yes"
      ];
      return {
        name: "Bash",
        aliases: ["sh"],
        keywords: {
          $pattern: /\b[a-z._-]+\b/,
          keyword: KEYWORDS,
          literal: LITERALS,
          built_in: [
            ...SHELL_BUILT_INS,
            ...BASH_BUILT_INS,
            // Shell modifiers
            "set",
            "shopt",
            ...ZSH_BUILT_INS,
            ...GNU_CORE_UTILS
          ]
        },
        contains: [
          KNOWN_SHEBANG,
          // to catch known shells and boost relevancy
          hljs.SHEBANG(),
          // to catch unknown shells but still highlight the shebang
          FUNCTION,
          ARITHMETIC,
          hljs.HASH_COMMENT_MODE,
          HERE_DOC,
          PATH_MODE,
          QUOTE_STRING,
          ESCAPED_QUOTE,
          APOS_STRING,
          VAR
        ]
      };
    }
    module.exports = bash;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/c.js
var require_c = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/c.js"(exports, module) {
    function c(hljs) {
      const regex = hljs.regex;
      const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", {
        contains: [
          {
            begin: /\\\n/
          }
        ]
      });
      const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
      const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
      const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
      const FUNCTION_TYPE_RE = "(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
      const TYPES = {
        className: "type",
        variants: [
          { begin: "\\b[a-z\\d_]*_t\\b" },
          { match: /\batomic_[a-z]{3,6}\b/ }
        ]
      };
      const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
      const STRINGS = {
        className: "string",
        variants: [
          {
            begin: '(u8?|U|L)?"',
            end: '"',
            illegal: "\\n",
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
            end: "'",
            illegal: "."
          },
          hljs.END_SAME_AS_BEGIN({
            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
            end: /\)([^()\\ ]{0,16})"/
          })
        ]
      };
      const NUMBERS = {
        className: "number",
        variants: [
          {
            begin: "\\b(0b[01']+)"
          },
          {
            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
          },
          {
            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
          }
        ],
        relevance: 0
      };
      const PREPROCESSOR = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [
          {
            begin: /\\\n/,
            relevance: 0
          },
          hljs.inherit(STRINGS, {
            className: "string"
          }),
          {
            className: "string",
            begin: /<.*?>/
          },
          C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      };
      const TITLE_MODE = {
        className: "title",
        begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
        relevance: 0
      };
      const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
      const C_KEYWORDS = [
        "asm",
        "auto",
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "enum",
        "extern",
        "for",
        "fortran",
        "goto",
        "if",
        "inline",
        "register",
        "restrict",
        "return",
        "sizeof",
        "struct",
        "switch",
        "typedef",
        "union",
        "volatile",
        "while",
        "_Alignas",
        "_Alignof",
        "_Atomic",
        "_Generic",
        "_Noreturn",
        "_Static_assert",
        "_Thread_local",
        // aliases
        "alignas",
        "alignof",
        "noreturn",
        "static_assert",
        "thread_local",
        // not a C keyword but is, for all intents and purposes, treated exactly like one.
        "_Pragma"
      ];
      const C_TYPES = [
        "float",
        "double",
        "signed",
        "unsigned",
        "int",
        "short",
        "long",
        "char",
        "void",
        "_Bool",
        "_Complex",
        "_Imaginary",
        "_Decimal32",
        "_Decimal64",
        "_Decimal128",
        // modifiers
        "const",
        "static",
        // aliases
        "complex",
        "bool",
        "imaginary"
      ];
      const KEYWORDS = {
        keyword: C_KEYWORDS,
        type: C_TYPES,
        literal: "true false NULL",
        // TODO: apply hinting work similar to what was done in cpp.js
        built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
      };
      const EXPRESSION_CONTAINS = [
        PREPROCESSOR,
        TYPES,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBERS,
        STRINGS
      ];
      const EXPRESSION_CONTEXT = {
        // This mode covers expression context where we can't expect a function
        // definition and shouldn't highlight anything that looks like one:
        // `return some()`, `else if()`, `(x*sum(1, 2))`
        variants: [
          {
            begin: /=/,
            end: /;/
          },
          {
            begin: /\(/,
            end: /\)/
          },
          {
            beginKeywords: "new throw return else",
            end: /;/
          }
        ],
        keywords: KEYWORDS,
        contains: EXPRESSION_CONTAINS.concat([
          {
            begin: /\(/,
            end: /\)/,
            keywords: KEYWORDS,
            contains: EXPRESSION_CONTAINS.concat(["self"]),
            relevance: 0
          }
        ]),
        relevance: 0
      };
      const FUNCTION_DECLARATION = {
        begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+)+" + FUNCTION_TITLE,
        returnBegin: true,
        end: /[{;=]/,
        excludeEnd: true,
        keywords: KEYWORDS,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [
          {
            // to prevent it from being confused as the function title
            begin: DECLTYPE_AUTO_RE,
            keywords: KEYWORDS,
            relevance: 0
          },
          {
            begin: FUNCTION_TITLE,
            returnBegin: true,
            contains: [
              hljs.inherit(TITLE_MODE, { className: "title.function" })
            ],
            relevance: 0
          },
          // allow for multiple declarations, e.g.:
          // extern void f(int), g(char);
          {
            relevance: 0,
            match: /,/
          },
          {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: KEYWORDS,
            relevance: 0,
            contains: [
              C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRINGS,
              NUMBERS,
              TYPES,
              // Count matching parentheses.
              {
                begin: /\(/,
                end: /\)/,
                keywords: KEYWORDS,
                relevance: 0,
                contains: [
                  "self",
                  C_LINE_COMMENT_MODE,
                  hljs.C_BLOCK_COMMENT_MODE,
                  STRINGS,
                  NUMBERS,
                  TYPES
                ]
              }
            ]
          },
          TYPES,
          C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          PREPROCESSOR
        ]
      };
      return {
        name: "C",
        aliases: [
          "h"
        ],
        keywords: KEYWORDS,
        // Until differentiations are added between `c` and `cpp`, `c` will
        // not be auto-detected to avoid auto-detect conflicts between C and C++
        disableAutodetect: true,
        illegal: "</",
        contains: [].concat(
          EXPRESSION_CONTEXT,
          FUNCTION_DECLARATION,
          EXPRESSION_CONTAINS,
          [
            PREPROCESSOR,
            {
              begin: hljs.IDENT_RE + "::",
              keywords: KEYWORDS
            },
            {
              className: "class",
              beginKeywords: "enum class struct union",
              end: /[{;:<>=]/,
              contains: [
                {
                  beginKeywords: "final class struct"
                },
                hljs.TITLE_MODE
              ]
            }
          ]
        ),
        exports: {
          preprocessor: PREPROCESSOR,
          strings: STRINGS,
          keywords: KEYWORDS
        }
      };
    }
    module.exports = c;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/cpp.js
var require_cpp = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/cpp.js"(exports, module) {
    function cpp(hljs) {
      const regex = hljs.regex;
      const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", {
        contains: [
          {
            begin: /\\\n/
          }
        ]
      });
      const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
      const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
      const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
      const FUNCTION_TYPE_RE = "(?!struct)(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
      const CPP_PRIMITIVE_TYPES = {
        className: "type",
        begin: "\\b[a-z\\d_]*_t\\b"
      };
      const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
      const STRINGS = {
        className: "string",
        variants: [
          {
            begin: '(u8?|U|L)?"',
            end: '"',
            illegal: "\\n",
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
            end: "'",
            illegal: "."
          },
          hljs.END_SAME_AS_BEGIN({
            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
            end: /\)([^()\\ ]{0,16})"/
          })
        ]
      };
      const NUMBERS = {
        className: "number",
        variants: [
          {
            begin: "\\b(0b[01']+)"
          },
          {
            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
          },
          {
            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
          }
        ],
        relevance: 0
      };
      const PREPROCESSOR = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [
          {
            begin: /\\\n/,
            relevance: 0
          },
          hljs.inherit(STRINGS, {
            className: "string"
          }),
          {
            className: "string",
            begin: /<.*?>/
          },
          C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      };
      const TITLE_MODE = {
        className: "title",
        begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
        relevance: 0
      };
      const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
      const RESERVED_KEYWORDS = [
        "alignas",
        "alignof",
        "and",
        "and_eq",
        "asm",
        "atomic_cancel",
        "atomic_commit",
        "atomic_noexcept",
        "auto",
        "bitand",
        "bitor",
        "break",
        "case",
        "catch",
        "class",
        "co_await",
        "co_return",
        "co_yield",
        "compl",
        "concept",
        "const_cast|10",
        "consteval",
        "constexpr",
        "constinit",
        "continue",
        "decltype",
        "default",
        "delete",
        "do",
        "dynamic_cast|10",
        "else",
        "enum",
        "explicit",
        "export",
        "extern",
        "false",
        "final",
        "for",
        "friend",
        "goto",
        "if",
        "import",
        "inline",
        "module",
        "mutable",
        "namespace",
        "new",
        "noexcept",
        "not",
        "not_eq",
        "nullptr",
        "operator",
        "or",
        "or_eq",
        "override",
        "private",
        "protected",
        "public",
        "reflexpr",
        "register",
        "reinterpret_cast|10",
        "requires",
        "return",
        "sizeof",
        "static_assert",
        "static_cast|10",
        "struct",
        "switch",
        "synchronized",
        "template",
        "this",
        "thread_local",
        "throw",
        "transaction_safe",
        "transaction_safe_dynamic",
        "true",
        "try",
        "typedef",
        "typeid",
        "typename",
        "union",
        "using",
        "virtual",
        "volatile",
        "while",
        "xor",
        "xor_eq"
      ];
      const RESERVED_TYPES = [
        "bool",
        "char",
        "char16_t",
        "char32_t",
        "char8_t",
        "double",
        "float",
        "int",
        "long",
        "short",
        "void",
        "wchar_t",
        "unsigned",
        "signed",
        "const",
        "static"
      ];
      const TYPE_HINTS = [
        "any",
        "auto_ptr",
        "barrier",
        "binary_semaphore",
        "bitset",
        "complex",
        "condition_variable",
        "condition_variable_any",
        "counting_semaphore",
        "deque",
        "false_type",
        "future",
        "imaginary",
        "initializer_list",
        "istringstream",
        "jthread",
        "latch",
        "lock_guard",
        "multimap",
        "multiset",
        "mutex",
        "optional",
        "ostringstream",
        "packaged_task",
        "pair",
        "promise",
        "priority_queue",
        "queue",
        "recursive_mutex",
        "recursive_timed_mutex",
        "scoped_lock",
        "set",
        "shared_future",
        "shared_lock",
        "shared_mutex",
        "shared_timed_mutex",
        "shared_ptr",
        "stack",
        "string_view",
        "stringstream",
        "timed_mutex",
        "thread",
        "true_type",
        "tuple",
        "unique_lock",
        "unique_ptr",
        "unordered_map",
        "unordered_multimap",
        "unordered_multiset",
        "unordered_set",
        "variant",
        "vector",
        "weak_ptr",
        "wstring",
        "wstring_view"
      ];
      const FUNCTION_HINTS = [
        "abort",
        "abs",
        "acos",
        "apply",
        "as_const",
        "asin",
        "atan",
        "atan2",
        "calloc",
        "ceil",
        "cerr",
        "cin",
        "clog",
        "cos",
        "cosh",
        "cout",
        "declval",
        "endl",
        "exchange",
        "exit",
        "exp",
        "fabs",
        "floor",
        "fmod",
        "forward",
        "fprintf",
        "fputs",
        "free",
        "frexp",
        "fscanf",
        "future",
        "invoke",
        "isalnum",
        "isalpha",
        "iscntrl",
        "isdigit",
        "isgraph",
        "islower",
        "isprint",
        "ispunct",
        "isspace",
        "isupper",
        "isxdigit",
        "labs",
        "launder",
        "ldexp",
        "log",
        "log10",
        "make_pair",
        "make_shared",
        "make_shared_for_overwrite",
        "make_tuple",
        "make_unique",
        "malloc",
        "memchr",
        "memcmp",
        "memcpy",
        "memset",
        "modf",
        "move",
        "pow",
        "printf",
        "putchar",
        "puts",
        "realloc",
        "scanf",
        "sin",
        "sinh",
        "snprintf",
        "sprintf",
        "sqrt",
        "sscanf",
        "std",
        "stderr",
        "stdin",
        "stdout",
        "strcat",
        "strchr",
        "strcmp",
        "strcpy",
        "strcspn",
        "strlen",
        "strncat",
        "strncmp",
        "strncpy",
        "strpbrk",
        "strrchr",
        "strspn",
        "strstr",
        "swap",
        "tan",
        "tanh",
        "terminate",
        "to_underlying",
        "tolower",
        "toupper",
        "vfprintf",
        "visit",
        "vprintf",
        "vsprintf"
      ];
      const LITERALS = [
        "NULL",
        "false",
        "nullopt",
        "nullptr",
        "true"
      ];
      const BUILT_IN = [
        "_Pragma"
      ];
      const CPP_KEYWORDS = {
        type: RESERVED_TYPES,
        keyword: RESERVED_KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_IN,
        _type_hints: TYPE_HINTS
      };
      const FUNCTION_DISPATCH = {
        className: "function.dispatch",
        relevance: 0,
        keywords: {
          // Only for relevance, not highlighting.
          _hint: FUNCTION_HINTS
        },
        begin: regex.concat(
          /\b/,
          /(?!decltype)/,
          /(?!if)/,
          /(?!for)/,
          /(?!switch)/,
          /(?!while)/,
          hljs.IDENT_RE,
          regex.lookahead(/(<[^<>]+>|)\s*\(/)
        )
      };
      const EXPRESSION_CONTAINS = [
        FUNCTION_DISPATCH,
        PREPROCESSOR,
        CPP_PRIMITIVE_TYPES,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBERS,
        STRINGS
      ];
      const EXPRESSION_CONTEXT = {
        // This mode covers expression context where we can't expect a function
        // definition and shouldn't highlight anything that looks like one:
        // `return some()`, `else if()`, `(x*sum(1, 2))`
        variants: [
          {
            begin: /=/,
            end: /;/
          },
          {
            begin: /\(/,
            end: /\)/
          },
          {
            beginKeywords: "new throw return else",
            end: /;/
          }
        ],
        keywords: CPP_KEYWORDS,
        contains: EXPRESSION_CONTAINS.concat([
          {
            begin: /\(/,
            end: /\)/,
            keywords: CPP_KEYWORDS,
            contains: EXPRESSION_CONTAINS.concat(["self"]),
            relevance: 0
          }
        ]),
        relevance: 0
      };
      const FUNCTION_DECLARATION = {
        className: "function",
        begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+)+" + FUNCTION_TITLE,
        returnBegin: true,
        end: /[{;=]/,
        excludeEnd: true,
        keywords: CPP_KEYWORDS,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [
          {
            // to prevent it from being confused as the function title
            begin: DECLTYPE_AUTO_RE,
            keywords: CPP_KEYWORDS,
            relevance: 0
          },
          {
            begin: FUNCTION_TITLE,
            returnBegin: true,
            contains: [TITLE_MODE],
            relevance: 0
          },
          // needed because we do not have look-behind on the below rule
          // to prevent it from grabbing the final : in a :: pair
          {
            begin: /::/,
            relevance: 0
          },
          // initializers
          {
            begin: /:/,
            endsWithParent: true,
            contains: [
              STRINGS,
              NUMBERS
            ]
          },
          // allow for multiple declarations, e.g.:
          // extern void f(int), g(char);
          {
            relevance: 0,
            match: /,/
          },
          {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: CPP_KEYWORDS,
            relevance: 0,
            contains: [
              C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRINGS,
              NUMBERS,
              CPP_PRIMITIVE_TYPES,
              // Count matching parentheses.
              {
                begin: /\(/,
                end: /\)/,
                keywords: CPP_KEYWORDS,
                relevance: 0,
                contains: [
                  "self",
                  C_LINE_COMMENT_MODE,
                  hljs.C_BLOCK_COMMENT_MODE,
                  STRINGS,
                  NUMBERS,
                  CPP_PRIMITIVE_TYPES
                ]
              }
            ]
          },
          CPP_PRIMITIVE_TYPES,
          C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          PREPROCESSOR
        ]
      };
      return {
        name: "C++",
        aliases: [
          "cc",
          "c++",
          "h++",
          "hpp",
          "hh",
          "hxx",
          "cxx"
        ],
        keywords: CPP_KEYWORDS,
        illegal: "</",
        classNameAliases: {
          "function.dispatch": "built_in"
        },
        contains: [].concat(
          EXPRESSION_CONTEXT,
          FUNCTION_DECLARATION,
          FUNCTION_DISPATCH,
          EXPRESSION_CONTAINS,
          [
            PREPROCESSOR,
            {
              // containers: ie, `vector <int> rooms (9);`
              begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
              end: ">",
              keywords: CPP_KEYWORDS,
              contains: [
                "self",
                CPP_PRIMITIVE_TYPES
              ]
            },
            {
              begin: hljs.IDENT_RE + "::",
              keywords: CPP_KEYWORDS
            },
            {
              match: [
                // extra complexity to deal with `enum class` and `enum struct`
                /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
                /\s+/,
                /\w+/
              ],
              className: {
                1: "keyword",
                3: "title.class"
              }
            }
          ]
        )
      };
    }
    module.exports = cpp;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/csharp.js
var require_csharp = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/csharp.js"(exports, module) {
    function csharp(hljs) {
      const BUILT_IN_KEYWORDS = [
        "bool",
        "byte",
        "char",
        "decimal",
        "delegate",
        "double",
        "dynamic",
        "enum",
        "float",
        "int",
        "long",
        "nint",
        "nuint",
        "object",
        "sbyte",
        "short",
        "string",
        "ulong",
        "uint",
        "ushort"
      ];
      const FUNCTION_MODIFIERS = [
        "public",
        "private",
        "protected",
        "static",
        "internal",
        "protected",
        "abstract",
        "async",
        "extern",
        "override",
        "unsafe",
        "virtual",
        "new",
        "sealed",
        "partial"
      ];
      const LITERAL_KEYWORDS = [
        "default",
        "false",
        "null",
        "true"
      ];
      const NORMAL_KEYWORDS = [
        "abstract",
        "as",
        "base",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "do",
        "else",
        "event",
        "explicit",
        "extern",
        "finally",
        "fixed",
        "for",
        "foreach",
        "goto",
        "if",
        "implicit",
        "in",
        "interface",
        "internal",
        "is",
        "lock",
        "namespace",
        "new",
        "operator",
        "out",
        "override",
        "params",
        "private",
        "protected",
        "public",
        "readonly",
        "record",
        "ref",
        "return",
        "sealed",
        "sizeof",
        "stackalloc",
        "static",
        "struct",
        "switch",
        "this",
        "throw",
        "try",
        "typeof",
        "unchecked",
        "unsafe",
        "using",
        "virtual",
        "void",
        "volatile",
        "while"
      ];
      const CONTEXTUAL_KEYWORDS = [
        "add",
        "alias",
        "and",
        "ascending",
        "async",
        "await",
        "by",
        "descending",
        "equals",
        "from",
        "get",
        "global",
        "group",
        "init",
        "into",
        "join",
        "let",
        "nameof",
        "not",
        "notnull",
        "on",
        "or",
        "orderby",
        "partial",
        "remove",
        "select",
        "set",
        "unmanaged",
        "value|0",
        "var",
        "when",
        "where",
        "with",
        "yield"
      ];
      const KEYWORDS = {
        keyword: NORMAL_KEYWORDS.concat(CONTEXTUAL_KEYWORDS),
        built_in: BUILT_IN_KEYWORDS,
        literal: LITERAL_KEYWORDS
      };
      const TITLE_MODE = hljs.inherit(hljs.TITLE_MODE, {
        begin: "[a-zA-Z](\\.?\\w)*"
      });
      const NUMBERS = {
        className: "number",
        variants: [
          {
            begin: "\\b(0b[01']+)"
          },
          {
            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
          },
          {
            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
          }
        ],
        relevance: 0
      };
      const VERBATIM_STRING = {
        className: "string",
        begin: '@"',
        end: '"',
        contains: [
          {
            begin: '""'
          }
        ]
      };
      const VERBATIM_STRING_NO_LF = hljs.inherit(VERBATIM_STRING, {
        illegal: /\n/
      });
      const SUBST = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS
      };
      const SUBST_NO_LF = hljs.inherit(SUBST, {
        illegal: /\n/
      });
      const INTERPOLATED_STRING = {
        className: "string",
        begin: /\$"/,
        end: '"',
        illegal: /\n/,
        contains: [
          {
            begin: /\{\{/
          },
          {
            begin: /\}\}/
          },
          hljs.BACKSLASH_ESCAPE,
          SUBST_NO_LF
        ]
      };
      const INTERPOLATED_VERBATIM_STRING = {
        className: "string",
        begin: /\$@"/,
        end: '"',
        contains: [
          {
            begin: /\{\{/
          },
          {
            begin: /\}\}/
          },
          {
            begin: '""'
          },
          SUBST
        ]
      };
      const INTERPOLATED_VERBATIM_STRING_NO_LF = hljs.inherit(INTERPOLATED_VERBATIM_STRING, {
        illegal: /\n/,
        contains: [
          {
            begin: /\{\{/
          },
          {
            begin: /\}\}/
          },
          {
            begin: '""'
          },
          SUBST_NO_LF
        ]
      });
      SUBST.contains = [
        INTERPOLATED_VERBATIM_STRING,
        INTERPOLATED_STRING,
        VERBATIM_STRING,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        NUMBERS,
        hljs.C_BLOCK_COMMENT_MODE
      ];
      SUBST_NO_LF.contains = [
        INTERPOLATED_VERBATIM_STRING_NO_LF,
        INTERPOLATED_STRING,
        VERBATIM_STRING_NO_LF,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        NUMBERS,
        hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, {
          illegal: /\n/
        })
      ];
      const STRING = {
        variants: [
          INTERPOLATED_VERBATIM_STRING,
          INTERPOLATED_STRING,
          VERBATIM_STRING,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      };
      const GENERIC_MODIFIER = {
        begin: "<",
        end: ">",
        contains: [
          {
            beginKeywords: "in out"
          },
          TITLE_MODE
        ]
      };
      const TYPE_IDENT_RE = hljs.IDENT_RE + "(<" + hljs.IDENT_RE + "(\\s*,\\s*" + hljs.IDENT_RE + ")*>)?(\\[\\])?";
      const AT_IDENTIFIER = {
        // prevents expressions like `@class` from incorrect flagging
        // `class` as a keyword
        begin: "@" + hljs.IDENT_RE,
        relevance: 0
      };
      return {
        name: "C#",
        aliases: [
          "cs",
          "c#"
        ],
        keywords: KEYWORDS,
        illegal: /::/,
        contains: [
          hljs.COMMENT(
            "///",
            "$",
            {
              returnBegin: true,
              contains: [
                {
                  className: "doctag",
                  variants: [
                    {
                      begin: "///",
                      relevance: 0
                    },
                    {
                      begin: "<!--|-->"
                    },
                    {
                      begin: "</?",
                      end: ">"
                    }
                  ]
                }
              ]
            }
          ),
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: "meta",
            begin: "#",
            end: "$",
            keywords: {
              keyword: "if else elif endif define undef warning error line region endregion pragma checksum"
            }
          },
          STRING,
          NUMBERS,
          {
            beginKeywords: "class interface",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:,]/,
            contains: [
              {
                beginKeywords: "where class"
              },
              TITLE_MODE,
              GENERIC_MODIFIER,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          {
            beginKeywords: "namespace",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [
              TITLE_MODE,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          {
            beginKeywords: "record",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [
              TITLE_MODE,
              GENERIC_MODIFIER,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          {
            // [Attributes("")]
            className: "meta",
            begin: "^\\s*\\[(?=[\\w])",
            excludeBegin: true,
            end: "\\]",
            excludeEnd: true,
            contains: [
              {
                className: "string",
                begin: /"/,
                end: /"/
              }
            ]
          },
          {
            // Expression keywords prevent 'keyword Name(...)' from being
            // recognized as a function definition
            beginKeywords: "new return throw await else",
            relevance: 0
          },
          {
            className: "function",
            begin: "(" + TYPE_IDENT_RE + "\\s+)+" + hljs.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
            returnBegin: true,
            end: /\s*[{;=]/,
            excludeEnd: true,
            keywords: KEYWORDS,
            contains: [
              // prevents these from being highlighted `title`
              {
                beginKeywords: FUNCTION_MODIFIERS.join(" "),
                relevance: 0
              },
              {
                begin: hljs.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                returnBegin: true,
                contains: [
                  hljs.TITLE_MODE,
                  GENERIC_MODIFIER
                ],
                relevance: 0
              },
              {
                match: /\(\)/
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: true,
                excludeEnd: true,
                keywords: KEYWORDS,
                relevance: 0,
                contains: [
                  STRING,
                  NUMBERS,
                  hljs.C_BLOCK_COMMENT_MODE
                ]
              },
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          AT_IDENTIFIER
        ]
      };
    }
    module.exports = csharp;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/css.js
var require_css = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/css.js"(exports, module) {
    var MODES = (hljs) => {
      return {
        IMPORTANT: {
          scope: "meta",
          begin: "!important"
        },
        BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
        },
        FUNCTION_DISPATCH: {
          className: "built_in",
          begin: /[\w-]+(?=\()/
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z][A-Za-z0-9_-]*/
        }
      };
    };
    var TAGS = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "p",
      "q",
      "quote",
      "samp",
      "section",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video"
    ];
    var MEDIA_FEATURES = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      // TODO: find a better solution?
      "min-width",
      "max-width",
      "min-height",
      "max-height"
    ];
    var PSEUDO_CLASSES = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      // dir()
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      // has()
      "host",
      // host or host()
      "host-context",
      // host-context()
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      // is()
      "lang",
      // lang()
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      // not()
      "nth-child",
      // nth-child()
      "nth-col",
      // nth-col()
      "nth-last-child",
      // nth-last-child()
      "nth-last-col",
      // nth-last-col()
      "nth-last-of-type",
      //nth-last-of-type()
      "nth-of-type",
      //nth-of-type()
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where"
      // where()
    ];
    var PSEUDO_ELEMENTS = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error"
    ];
    var ATTRIBUTES = [
      "align-content",
      "align-items",
      "align-self",
      "all",
      "animation",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-timing-function",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-repeat",
      "background-size",
      "border",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-decoration-break",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "direction",
      "display",
      "empty-cells",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-size",
      "font-size-adjust",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-variant",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "gap",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "isolation",
      "justify-content",
      "left",
      "letter-spacing",
      "line-break",
      "line-height",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "max-height",
      "max-width",
      "min-height",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "padding",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "pointer-events",
      "position",
      "quotes",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "row-gap",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "speak",
      "speak-as",
      "src",
      // @font-face
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-style",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-transform",
      "text-underline-position",
      "top",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "unicode-bidi",
      "vertical-align",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "z-index"
      // reverse makes sure longer attributes `font-weight` are matched fully
      // instead of getting false positives on say `font`
    ].reverse();
    function css(hljs) {
      const regex = hljs.regex;
      const modes = MODES(hljs);
      const VENDOR_PREFIX = {
        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
      };
      const AT_MODIFIERS = "and or not only";
      const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
      const IDENT_RE = "[a-zA-Z-][a-zA-Z0-9_-]*";
      const STRINGS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ];
      return {
        name: "CSS",
        case_insensitive: true,
        illegal: /[=|'\$]/,
        keywords: {
          keyframePosition: "from to"
        },
        classNameAliases: {
          // for visual continuity with `tag {}` and because we
          // don't have a great class for this?
          keyframePosition: "selector-tag"
        },
        contains: [
          modes.BLOCK_COMMENT,
          VENDOR_PREFIX,
          // to recognize keyframe 40% etc which are outside the scope of our
          // attribute value mode
          modes.CSS_NUMBER_MODE,
          {
            className: "selector-id",
            begin: /#[A-Za-z0-9_-]+/,
            relevance: 0
          },
          {
            className: "selector-class",
            begin: "\\." + IDENT_RE,
            relevance: 0
          },
          modes.ATTRIBUTE_SELECTOR_MODE,
          {
            className: "selector-pseudo",
            variants: [
              {
                begin: ":(" + PSEUDO_CLASSES.join("|") + ")"
              },
              {
                begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")"
              }
            ]
          },
          // we may actually need this (12/2020)
          // { // pseudo-selector params
          //   begin: /\(/,
          //   end: /\)/,
          //   contains: [ hljs.CSS_NUMBER_MODE ]
          // },
          modes.CSS_VARIABLE,
          {
            className: "attribute",
            begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
          },
          // attribute values
          {
            begin: /:/,
            end: /[;}{]/,
            contains: [
              modes.BLOCK_COMMENT,
              modes.HEXCOLOR,
              modes.IMPORTANT,
              modes.CSS_NUMBER_MODE,
              ...STRINGS,
              // needed to highlight these as strings and to avoid issues with
              // illegal characters that might be inside urls that would tigger the
              // languages illegal stack
              {
                begin: /(url|data-uri)\(/,
                end: /\)/,
                relevance: 0,
                // from keywords
                keywords: {
                  built_in: "url data-uri"
                },
                contains: [
                  {
                    className: "string",
                    // any character other than `)` as in `url()` will be the start
                    // of a string, which ends with `)` (from the parent mode)
                    begin: /[^)]/,
                    endsWithParent: true,
                    excludeEnd: true
                  }
                ]
              },
              modes.FUNCTION_DISPATCH
            ]
          },
          {
            begin: regex.lookahead(/@/),
            end: "[{;]",
            relevance: 0,
            illegal: /:/,
            // break on Less variables @var: ...
            contains: [
              {
                className: "keyword",
                begin: AT_PROPERTY_RE
              },
              {
                begin: /\s/,
                endsWithParent: true,
                excludeEnd: true,
                relevance: 0,
                keywords: {
                  $pattern: /[a-z-]+/,
                  keyword: AT_MODIFIERS,
                  attribute: MEDIA_FEATURES.join(" ")
                },
                contains: [
                  {
                    begin: /[a-z-]+(?=:)/,
                    className: "attribute"
                  },
                  ...STRINGS,
                  modes.CSS_NUMBER_MODE
                ]
              }
            ]
          },
          {
            className: "selector-tag",
            begin: "\\b(" + TAGS.join("|") + ")\\b"
          }
        ]
      };
    }
    module.exports = css;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/markdown.js
var require_markdown = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/markdown.js"(exports, module) {
    function markdown(hljs) {
      const regex = hljs.regex;
      const INLINE_HTML = {
        begin: /<\/?[A-Za-z_]/,
        end: ">",
        subLanguage: "xml",
        relevance: 0
      };
      const HORIZONTAL_RULE = {
        begin: "^[-\\*]{3,}",
        end: "$"
      };
      const CODE = {
        className: "code",
        variants: [
          // TODO: fix to allow these to work with sublanguage also
          {
            begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*"
          },
          {
            begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
          },
          // needed to allow markdown as a sublanguage to work
          {
            begin: "```",
            end: "```+[ ]*$"
          },
          {
            begin: "~~~",
            end: "~~~+[ ]*$"
          },
          {
            begin: "`.+?`"
          },
          {
            begin: "(?=^( {4}|\\t))",
            // use contains to gobble up multiple lines to allow the block to be whatever size
            // but only have a single open/close tag vs one per line
            contains: [
              {
                begin: "^( {4}|\\t)",
                end: "(\\n)$"
              }
            ],
            relevance: 0
          }
        ]
      };
      const LIST = {
        className: "bullet",
        begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
        end: "\\s+",
        excludeEnd: true
      };
      const LINK_REFERENCE = {
        begin: /^\[[^\n]+\]:/,
        returnBegin: true,
        contains: [
          {
            className: "symbol",
            begin: /\[/,
            end: /\]/,
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: "link",
            begin: /:\s*/,
            end: /$/,
            excludeBegin: true
          }
        ]
      };
      const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
      const LINK = {
        variants: [
          // too much like nested array access in so many languages
          // to have any real relevance
          {
            begin: /\[.+?\]\[.*?\]/,
            relevance: 0
          },
          // popular internet URLs
          {
            begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
            relevance: 2
          },
          {
            begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
            relevance: 2
          },
          // relative urls
          {
            begin: /\[.+?\]\([./?&#].*?\)/,
            relevance: 1
          },
          // whatever else, lower relevance (might not be a link at all)
          {
            begin: /\[.*?\]\(.*?\)/,
            relevance: 0
          }
        ],
        returnBegin: true,
        contains: [
          {
            // empty strings for alt or link text
            match: /\[(?=\])/
          },
          {
            className: "string",
            relevance: 0,
            begin: "\\[",
            end: "\\]",
            excludeBegin: true,
            returnEnd: true
          },
          {
            className: "link",
            relevance: 0,
            begin: "\\]\\(",
            end: "\\)",
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: "symbol",
            relevance: 0,
            begin: "\\]\\[",
            end: "\\]",
            excludeBegin: true,
            excludeEnd: true
          }
        ]
      };
      const BOLD = {
        className: "strong",
        contains: [],
        // defined later
        variants: [
          {
            begin: /_{2}/,
            end: /_{2}/
          },
          {
            begin: /\*{2}/,
            end: /\*{2}/
          }
        ]
      };
      const ITALIC = {
        className: "emphasis",
        contains: [],
        // defined later
        variants: [
          {
            begin: /\*(?!\*)/,
            end: /\*/
          },
          {
            begin: /_(?!_)/,
            end: /_/,
            relevance: 0
          }
        ]
      };
      BOLD.contains.push(ITALIC);
      ITALIC.contains.push(BOLD);
      let CONTAINABLE = [
        INLINE_HTML,
        LINK
      ];
      BOLD.contains = BOLD.contains.concat(CONTAINABLE);
      ITALIC.contains = ITALIC.contains.concat(CONTAINABLE);
      CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
      const HEADER = {
        className: "section",
        variants: [
          {
            begin: "^#{1,6}",
            end: "$",
            contains: CONTAINABLE
          },
          {
            begin: "(?=^.+?\\n[=-]{2,}$)",
            contains: [
              {
                begin: "^[=-]*$"
              },
              {
                begin: "^",
                end: "\\n",
                contains: CONTAINABLE
              }
            ]
          }
        ]
      };
      const BLOCKQUOTE = {
        className: "quote",
        begin: "^>\\s+",
        contains: CONTAINABLE,
        end: "$"
      };
      return {
        name: "Markdown",
        aliases: [
          "md",
          "mkdown",
          "mkd"
        ],
        contains: [
          HEADER,
          INLINE_HTML,
          LIST,
          BOLD,
          ITALIC,
          BLOCKQUOTE,
          CODE,
          HORIZONTAL_RULE,
          LINK,
          LINK_REFERENCE
        ]
      };
    }
    module.exports = markdown;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/diff.js
var require_diff = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/diff.js"(exports, module) {
    function diff(hljs) {
      const regex = hljs.regex;
      return {
        name: "Diff",
        aliases: ["patch"],
        contains: [
          {
            className: "meta",
            relevance: 10,
            match: regex.either(
              /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
              /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
              /^--- +\d+,\d+ +----$/
            )
          },
          {
            className: "comment",
            variants: [
              {
                begin: regex.either(
                  /Index: /,
                  /^index/,
                  /={3,}/,
                  /^-{3}/,
                  /^\*{3} /,
                  /^\+{3}/,
                  /^diff --git/
                ),
                end: /$/
              },
              {
                match: /^\*{15}$/
              }
            ]
          },
          {
            className: "addition",
            begin: /^\+/,
            end: /$/
          },
          {
            className: "deletion",
            begin: /^-/,
            end: /$/
          },
          {
            className: "addition",
            begin: /^!/,
            end: /$/
          }
        ]
      };
    }
    module.exports = diff;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/ruby.js
var require_ruby = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/ruby.js"(exports, module) {
    function ruby(hljs) {
      const regex = hljs.regex;
      const RUBY_METHOD_RE = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)";
      const RUBY_KEYWORDS = {
        keyword: "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",
        built_in: "proc lambda",
        literal: "true false nil"
      };
      const YARDOCTAG = {
        className: "doctag",
        begin: "@[A-Za-z]+"
      };
      const IRB_OBJECT = {
        begin: "#<",
        end: ">"
      };
      const COMMENT_MODES = [
        hljs.COMMENT(
          "#",
          "$",
          {
            contains: [YARDOCTAG]
          }
        ),
        hljs.COMMENT(
          "^=begin",
          "^=end",
          {
            contains: [YARDOCTAG],
            relevance: 10
          }
        ),
        hljs.COMMENT("^__END__", "\\n$")
      ];
      const SUBST = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: RUBY_KEYWORDS
      };
      const STRING = {
        className: "string",
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        variants: [
          {
            begin: /'/,
            end: /'/
          },
          {
            begin: /"/,
            end: /"/
          },
          {
            begin: /`/,
            end: /`/
          },
          {
            begin: /%[qQwWx]?\(/,
            end: /\)/
          },
          {
            begin: /%[qQwWx]?\[/,
            end: /\]/
          },
          {
            begin: /%[qQwWx]?\{/,
            end: /\}/
          },
          {
            begin: /%[qQwWx]?</,
            end: />/
          },
          {
            begin: /%[qQwWx]?\//,
            end: /\//
          },
          {
            begin: /%[qQwWx]?%/,
            end: /%/
          },
          {
            begin: /%[qQwWx]?-/,
            end: /-/
          },
          {
            begin: /%[qQwWx]?\|/,
            end: /\|/
          },
          // in the following expressions, \B in the beginning suppresses recognition of ?-sequences
          // where ? is the last character of a preceding identifier, as in: `func?4`
          {
            begin: /\B\?(\\\d{1,3})/
          },
          {
            begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
          },
          {
            begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/
          },
          {
            begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
          },
          {
            begin: /\B\?\\(c|C-)[\x20-\x7e]/
          },
          {
            begin: /\B\?\\?\S/
          },
          // heredocs
          {
            // this guard makes sure that we have an entire heredoc and not a false
            // positive (auto-detect, etc.)
            begin: regex.concat(
              /<<[-~]?'?/,
              regex.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)
            ),
            contains: [
              hljs.END_SAME_AS_BEGIN({
                begin: /(\w+)/,
                end: /(\w+)/,
                contains: [
                  hljs.BACKSLASH_ESCAPE,
                  SUBST
                ]
              })
            ]
          }
        ]
      };
      const decimal = "[1-9](_?[0-9])*|0";
      const digits = "[0-9](_?[0-9])*";
      const NUMBER = {
        className: "number",
        relevance: 0,
        variants: [
          // decimal integer/float, optionally exponential or rational, optionally imaginary
          {
            begin: `\\b(${decimal})(\\.(${digits}))?([eE][+-]?(${digits})|r)?i?\\b`
          },
          // explicit decimal/binary/octal/hexadecimal integer,
          // optionally rational and/or imaginary
          {
            begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
          },
          {
            begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
          },
          {
            begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b"
          },
          {
            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
          },
          // 0-prefixed implicit octal integer, optionally rational and/or imaginary
          {
            begin: "\\b0(_?[0-7])+r?i?\\b"
          }
        ]
      };
      const PARAMS = {
        className: "params",
        begin: "\\(",
        end: "\\)",
        endsParent: true,
        keywords: RUBY_KEYWORDS
      };
      const RUBY_DEFAULT_CONTAINS = [
        STRING,
        {
          className: "class",
          beginKeywords: "class module",
          end: "$|;",
          illegal: /=/,
          contains: [
            hljs.inherit(hljs.TITLE_MODE, {
              begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
            }),
            {
              begin: "<\\s*",
              contains: [
                {
                  begin: "(" + hljs.IDENT_RE + "::)?" + hljs.IDENT_RE,
                  // we already get points for <, we don't need poitns
                  // for the name also
                  relevance: 0
                }
              ]
            }
          ].concat(COMMENT_MODES)
        },
        {
          className: "function",
          // def method_name(
          // def method_name;
          // def method_name (end of line)
          begin: regex.concat(/def\s+/, regex.lookahead(RUBY_METHOD_RE + "\\s*(\\(|;|$)")),
          relevance: 0,
          // relevance comes from kewords
          keywords: "def",
          end: "$|;",
          contains: [
            hljs.inherit(hljs.TITLE_MODE, {
              begin: RUBY_METHOD_RE
            }),
            PARAMS
          ].concat(COMMENT_MODES)
        },
        {
          // swallow namespace qualifiers before symbols
          begin: hljs.IDENT_RE + "::"
        },
        {
          className: "symbol",
          begin: hljs.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
          relevance: 0
        },
        {
          className: "symbol",
          begin: ":(?!\\s)",
          contains: [
            STRING,
            {
              begin: RUBY_METHOD_RE
            }
          ],
          relevance: 0
        },
        NUMBER,
        {
          // negative-look forward attempts to prevent false matches like:
          // @ident@ or $ident$ that might indicate this is not ruby at all
          className: "variable",
          begin: `(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])`
        },
        {
          className: "params",
          begin: /\|/,
          end: /\|/,
          relevance: 0,
          // this could be a lot of things (in other languages) other than params
          keywords: RUBY_KEYWORDS
        },
        {
          // regexp container
          begin: "(" + hljs.RE_STARTERS_RE + "|unless)\\s*",
          keywords: "unless",
          contains: [
            {
              className: "regexp",
              contains: [
                hljs.BACKSLASH_ESCAPE,
                SUBST
              ],
              illegal: /\n/,
              variants: [
                {
                  begin: "/",
                  end: "/[a-z]*"
                },
                {
                  begin: /%r\{/,
                  end: /\}[a-z]*/
                },
                {
                  begin: "%r\\(",
                  end: "\\)[a-z]*"
                },
                {
                  begin: "%r!",
                  end: "![a-z]*"
                },
                {
                  begin: "%r\\[",
                  end: "\\][a-z]*"
                }
              ]
            }
          ].concat(IRB_OBJECT, COMMENT_MODES),
          relevance: 0
        }
      ].concat(IRB_OBJECT, COMMENT_MODES);
      SUBST.contains = RUBY_DEFAULT_CONTAINS;
      PARAMS.contains = RUBY_DEFAULT_CONTAINS;
      const SIMPLE_PROMPT = "[>?]>";
      const DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+>";
      const RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>";
      const IRB_DEFAULT = [
        {
          begin: /^\s*=>/,
          starts: {
            end: "$",
            contains: RUBY_DEFAULT_CONTAINS
          }
        },
        {
          className: "meta",
          begin: "^(" + SIMPLE_PROMPT + "|" + DEFAULT_PROMPT + "|" + RVM_PROMPT + ")(?=[ ])",
          starts: {
            end: "$",
            contains: RUBY_DEFAULT_CONTAINS
          }
        }
      ];
      COMMENT_MODES.unshift(IRB_OBJECT);
      return {
        name: "Ruby",
        aliases: [
          "rb",
          "gemspec",
          "podspec",
          "thor",
          "irb"
        ],
        keywords: RUBY_KEYWORDS,
        illegal: /\/\*/,
        contains: [
          hljs.SHEBANG({
            binary: "ruby"
          })
        ].concat(IRB_DEFAULT).concat(COMMENT_MODES).concat(RUBY_DEFAULT_CONTAINS)
      };
    }
    module.exports = ruby;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/go.js
var require_go = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/go.js"(exports, module) {
    function go(hljs) {
      const LITERALS = [
        "true",
        "false",
        "iota",
        "nil"
      ];
      const BUILT_INS = [
        "append",
        "cap",
        "close",
        "complex",
        "copy",
        "imag",
        "len",
        "make",
        "new",
        "panic",
        "print",
        "println",
        "real",
        "recover",
        "delete"
      ];
      const TYPES = [
        "bool",
        "byte",
        "complex64",
        "complex128",
        "error",
        "float32",
        "float64",
        "int8",
        "int16",
        "int32",
        "int64",
        "string",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "int",
        "uint",
        "uintptr",
        "rune"
      ];
      const KWS = [
        "break",
        "case",
        "chan",
        "const",
        "continue",
        "default",
        "defer",
        "else",
        "fallthrough",
        "for",
        "func",
        "go",
        "goto",
        "if",
        "import",
        "interface",
        "map",
        "package",
        "range",
        "return",
        "select",
        "struct",
        "switch",
        "type",
        "var"
      ];
      const KEYWORDS = {
        keyword: KWS,
        type: TYPES,
        literal: LITERALS,
        built_in: BUILT_INS
      };
      return {
        name: "Go",
        aliases: ["golang"],
        keywords: KEYWORDS,
        illegal: "</",
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: "string",
            variants: [
              hljs.QUOTE_STRING_MODE,
              hljs.APOS_STRING_MODE,
              {
                begin: "`",
                end: "`"
              }
            ]
          },
          {
            className: "number",
            variants: [
              {
                begin: hljs.C_NUMBER_RE + "[i]",
                relevance: 1
              },
              hljs.C_NUMBER_MODE
            ]
          },
          {
            begin: /:=/
            // relevance booster
          },
          {
            className: "function",
            beginKeywords: "func",
            end: "\\s*(\\{|$)",
            excludeEnd: true,
            contains: [
              hljs.TITLE_MODE,
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                endsParent: true,
                keywords: KEYWORDS,
                illegal: /["']/
              }
            ]
          }
        ]
      };
    }
    module.exports = go;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/ini.js
var require_ini = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/ini.js"(exports, module) {
    function ini(hljs) {
      const regex = hljs.regex;
      const NUMBERS = {
        className: "number",
        relevance: 0,
        variants: [
          {
            begin: /([+-]+)?[\d]+_[\d_]+/
          },
          {
            begin: hljs.NUMBER_RE
          }
        ]
      };
      const COMMENTS = hljs.COMMENT();
      COMMENTS.variants = [
        {
          begin: /;/,
          end: /$/
        },
        {
          begin: /#/,
          end: /$/
        }
      ];
      const VARIABLES = {
        className: "variable",
        variants: [
          {
            begin: /\$[\w\d"][\w\d_]*/
          },
          {
            begin: /\$\{(.*?)\}/
          }
        ]
      };
      const LITERALS = {
        className: "literal",
        begin: /\bon|off|true|false|yes|no\b/
      };
      const STRINGS = {
        className: "string",
        contains: [hljs.BACKSLASH_ESCAPE],
        variants: [
          {
            begin: "'''",
            end: "'''",
            relevance: 10
          },
          {
            begin: '"""',
            end: '"""',
            relevance: 10
          },
          {
            begin: '"',
            end: '"'
          },
          {
            begin: "'",
            end: "'"
          }
        ]
      };
      const ARRAY = {
        begin: /\[/,
        end: /\]/,
        contains: [
          COMMENTS,
          LITERALS,
          VARIABLES,
          STRINGS,
          NUMBERS,
          "self"
        ],
        relevance: 0
      };
      const BARE_KEY = /[A-Za-z0-9_-]+/;
      const QUOTED_KEY_DOUBLE_QUOTE = /"(\\"|[^"])*"/;
      const QUOTED_KEY_SINGLE_QUOTE = /'[^']*'/;
      const ANY_KEY = regex.either(
        BARE_KEY,
        QUOTED_KEY_DOUBLE_QUOTE,
        QUOTED_KEY_SINGLE_QUOTE
      );
      const DOTTED_KEY = regex.concat(
        ANY_KEY,
        "(\\s*\\.\\s*",
        ANY_KEY,
        ")*",
        regex.lookahead(/\s*=\s*[^#\s]/)
      );
      return {
        name: "TOML, also INI",
        aliases: ["toml"],
        case_insensitive: true,
        illegal: /\S/,
        contains: [
          COMMENTS,
          {
            className: "section",
            begin: /\[+/,
            end: /\]+/
          },
          {
            begin: DOTTED_KEY,
            className: "attr",
            starts: {
              end: /$/,
              contains: [
                COMMENTS,
                ARRAY,
                LITERALS,
                VARIABLES,
                STRINGS,
                NUMBERS
              ]
            }
          }
        ]
      };
    }
    module.exports = ini;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/java.js
var require_java = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/java.js"(exports, module) {
    var decimalDigits = "[0-9](_*[0-9])*";
    var frac = `\\.(${decimalDigits})`;
    var hexDigits = "[0-9a-fA-F](_*[0-9a-fA-F])*";
    var NUMERIC = {
      className: "number",
      variants: [
        // DecimalFloatingPointLiteral
        // including ExponentPart
        { begin: `(\\b(${decimalDigits})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})[fFdD]?\\b` },
        // excluding ExponentPart
        { begin: `\\b(${decimalDigits})((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
        { begin: `(${frac})[fFdD]?\\b` },
        { begin: `\\b(${decimalDigits})[fFdD]\\b` },
        // HexadecimalFloatingPointLiteral
        { begin: `\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))[pP][+-]?(${decimalDigits})[fFdD]?\\b` },
        // DecimalIntegerLiteral
        { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
        // HexIntegerLiteral
        { begin: `\\b0[xX](${hexDigits})[lL]?\\b` },
        // OctalIntegerLiteral
        { begin: "\\b0(_*[0-7])*[lL]?\\b" },
        // BinaryIntegerLiteral
        { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
      ],
      relevance: 0
    };
    function recurRegex(re, substitution, depth) {
      if (depth === -1) return "";
      return re.replace(substitution, (_) => {
        return recurRegex(re, substitution, depth - 1);
      });
    }
    function java(hljs) {
      hljs.regex;
      const JAVA_IDENT_RE = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*";
      const GENERIC_IDENT_RE = JAVA_IDENT_RE + recurRegex("(?:<" + JAVA_IDENT_RE + "~~~(?:\\s*,\\s*" + JAVA_IDENT_RE + "~~~)*>)?", /~~~/g, 2);
      const MAIN_KEYWORDS = [
        "synchronized",
        "abstract",
        "private",
        "var",
        "static",
        "if",
        "const ",
        "for",
        "while",
        "strictfp",
        "finally",
        "protected",
        "import",
        "native",
        "final",
        "void",
        "enum",
        "else",
        "break",
        "transient",
        "catch",
        "instanceof",
        "volatile",
        "case",
        "assert",
        "package",
        "default",
        "public",
        "try",
        "switch",
        "continue",
        "throws",
        "protected",
        "public",
        "private",
        "module",
        "requires",
        "exports",
        "do",
        "sealed"
      ];
      const BUILT_INS = [
        "super",
        "this"
      ];
      const LITERALS = [
        "false",
        "true",
        "null"
      ];
      const TYPES = [
        "char",
        "boolean",
        "long",
        "float",
        "int",
        "byte",
        "short",
        "double"
      ];
      const KEYWORDS = {
        keyword: MAIN_KEYWORDS,
        literal: LITERALS,
        type: TYPES,
        built_in: BUILT_INS
      };
      const ANNOTATION = {
        className: "meta",
        begin: "@" + JAVA_IDENT_RE,
        contains: [
          {
            begin: /\(/,
            end: /\)/,
            contains: ["self"]
            // allow nested () inside our annotation
          }
        ]
      };
      const PARAMS = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        keywords: KEYWORDS,
        relevance: 0,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE
        ],
        endsParent: true
      };
      return {
        name: "Java",
        aliases: ["jsp"],
        keywords: KEYWORDS,
        illegal: /<\/|#/,
        contains: [
          hljs.COMMENT(
            "/\\*\\*",
            "\\*/",
            {
              relevance: 0,
              contains: [
                {
                  // eat up @'s in emails to prevent them to be recognized as doctags
                  begin: /\w+@/,
                  relevance: 0
                },
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                }
              ]
            }
          ),
          // relevance boost
          {
            begin: /import java\.[a-z]+\./,
            keywords: "import",
            relevance: 2
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            begin: /"""/,
            end: /"""/,
            className: "string",
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          {
            match: [
              /\b(?:class|interface|enum|extends|implements|new)/,
              /\s+/,
              JAVA_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "title.class"
            }
          },
          {
            // Exceptions for hyphenated keywords
            match: /non-sealed/,
            scope: "keyword"
          },
          {
            begin: [
              JAVA_IDENT_RE,
              /\s+/,
              JAVA_IDENT_RE,
              /\s+/,
              /=/
            ],
            className: {
              1: "type",
              3: "variable",
              5: "operator"
            }
          },
          {
            begin: [
              /record/,
              /\s+/,
              JAVA_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "title.class"
            },
            contains: [
              PARAMS,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          {
            // Expression keywords prevent 'keyword Name(...)' from being
            // recognized as a function definition
            beginKeywords: "new throw return else",
            relevance: 0
          },
          {
            begin: [
              "(?:" + GENERIC_IDENT_RE + "\\s+)",
              hljs.UNDERSCORE_IDENT_RE,
              /\s*(?=\()/
            ],
            className: {
              2: "title.function"
            },
            keywords: KEYWORDS,
            contains: [
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: KEYWORDS,
                relevance: 0,
                contains: [
                  ANNOTATION,
                  hljs.APOS_STRING_MODE,
                  hljs.QUOTE_STRING_MODE,
                  NUMERIC,
                  hljs.C_BLOCK_COMMENT_MODE
                ]
              },
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          NUMERIC,
          ANNOTATION
        ]
      };
    }
    module.exports = java;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/javascript.js
var require_javascript = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/javascript.js"(exports, module) {
    var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    var KEYWORDS = [
      "as",
      // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends"
    ];
    var LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];
    var TYPES = [
      // Fundamental objects
      "Object",
      "Function",
      "Boolean",
      "Symbol",
      // numbers and dates
      "Math",
      "Date",
      "Number",
      "BigInt",
      // text
      "String",
      "RegExp",
      // Indexed collections
      "Array",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Int32Array",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array",
      // Keyed collections
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      // Structured data
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Atomics",
      "DataView",
      "JSON",
      // Control abstraction objects
      "Promise",
      "Generator",
      "GeneratorFunction",
      "AsyncFunction",
      // Reflection
      "Reflect",
      "Proxy",
      // Internationalization
      "Intl",
      // WebAssembly
      "WebAssembly"
    ];
    var ERROR_TYPES = [
      "Error",
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];
    var BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];
    var BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global"
      // Node.js
    ];
    var BUILT_INS = [].concat(
      BUILT_IN_GLOBALS,
      TYPES,
      ERROR_TYPES
    );
    function javascript(hljs) {
      const regex = hljs.regex;
      const hasClosingTag = (match, { after }) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
      };
      const IDENT_RE$1 = IDENT_RE;
      const FRAGMENT = {
        begin: "<>",
        end: "</>"
      };
      const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
      const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        /**
         * @param {RegExpMatchArray} match
         * @param {CallbackResponse} response
         */
        isTrulyOpeningTag: (match, response) => {
          const afterMatchIndex = match[0].length + match.index;
          const nextChar = match.input[afterMatchIndex];
          if (
            // HTML should not include another raw `<` inside a tag
            // nested type?
            // `<Array<Array<number>>`, etc.
            nextChar === "<" || // the , gives away that this is not HTML
            // `<T, A extends keyof T, V>`
            nextChar === ","
          ) {
            response.ignoreMatch();
            return;
          }
          if (nextChar === ">") {
            if (!hasClosingTag(match, { after: afterMatchIndex })) {
              response.ignoreMatch();
            }
          }
          let m;
          const afterMatch = match.input.substr(afterMatchIndex);
          if (m = afterMatch.match(/^\s+extends\s+/)) {
            if (m.index === 0) {
              response.ignoreMatch();
              return;
            }
          }
        }
      };
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS,
        "variable.language": BUILT_IN_VARIABLES
      };
      const decimalDigits = "[0-9](_?[0-9])*";
      const frac = `\\.(${decimalDigits})`;
      const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
      const NUMBER = {
        className: "number",
        variants: [
          // DecimalLiteral
          { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
          { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
          // DecimalBigIntegerLiteral
          { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
          // NonDecimalIntegerLiteral
          { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
          { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
          // LegacyOctalIntegerLiteral (does not include underscore separators)
          // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
          { begin: "\\b0[0-7]+n?\\b" }
        ],
        relevance: 0
      };
      const SUBST = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: KEYWORDS$1,
        contains: []
        // defined later
      };
      const HTML_TEMPLATE = {
        begin: "html`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "xml"
        }
      };
      const CSS_TEMPLATE = {
        begin: "css`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "css"
        }
      };
      const TEMPLATE_STRING = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      };
      const JSDOC_COMMENT = hljs.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: true,
                  excludeBegin: true,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                  endsParent: true,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      );
      const COMMENT = {
        className: "comment",
        variants: [
          JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      };
      const SUBST_INTERNALS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        NUMBER
        // This is intentional:
        // See https://github.com/highlightjs/highlight.js/issues/3288
        // hljs.REGEXP_MODE
      ];
      SUBST.contains = SUBST_INTERNALS.concat({
        // we need to pair up {} inside our subst to prevent
        // it from ending too early by matching another }
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS$1,
        contains: [
          "self"
        ].concat(SUBST_INTERNALS)
      });
      const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
      const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        // eat recursive parens in sub expressions
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS$1,
          contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
      ]);
      const PARAMS = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
      };
      const CLASS_OR_EXTENDS = {
        variants: [
          // class Car extends vehicle
          {
            match: [
              /class/,
              /\s+/,
              IDENT_RE$1,
              /\s+/,
              /extends/,
              /\s+/,
              regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
            ],
            scope: {
              1: "keyword",
              3: "title.class",
              5: "keyword",
              7: "title.class.inherited"
            }
          },
          // class Car
          {
            match: [
              /class/,
              /\s+/,
              IDENT_RE$1
            ],
            scope: {
              1: "keyword",
              3: "title.class"
            }
          }
        ]
      };
      const CLASS_REFERENCE = {
        relevance: 0,
        match: regex.either(
          // Hard coded exceptions
          /\bJSON/,
          // Float32Array, OutT
          /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
          // CSSFactory, CSSFactoryT
          /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
          // FPs, FPsT
          /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
          // P
          // single letters are not highlighted
          // BLAH
          // this will be flagged as a UPPER_CASE_CONSTANT instead
        ),
        className: "title.class",
        keywords: {
          _: [
            // se we still get relevance credit for JS library classes
            ...TYPES,
            ...ERROR_TYPES
          ]
        }
      };
      const USE_STRICT = {
        label: "use_strict",
        className: "meta",
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      };
      const FUNCTION_DEFINITION = {
        variants: [
          {
            match: [
              /function/,
              /\s+/,
              IDENT_RE$1,
              /(?=\s*\()/
            ]
          },
          // anonymous function
          {
            match: [
              /function/,
              /\s*(?=\()/
            ]
          }
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        label: "func.def",
        contains: [PARAMS],
        illegal: /%/
      };
      const UPPER_CASE_CONSTANT = {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant"
      };
      function noneOf(list) {
        return regex.concat("(?!", list.join("|"), ")");
      }
      const FUNCTION_CALL = {
        match: regex.concat(
          /\b/,
          noneOf([
            ...BUILT_IN_GLOBALS,
            "super"
          ]),
          IDENT_RE$1,
          regex.lookahead(/\(/)
        ),
        className: "title.function",
        relevance: 0
      };
      const PROPERTY_ACCESS = {
        begin: regex.concat(/\./, regex.lookahead(
          regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
        )),
        end: IDENT_RE$1,
        excludeBegin: true,
        keywords: "prototype",
        className: "property",
        relevance: 0
      };
      const GETTER_OR_SETTER = {
        match: [
          /get|set/,
          /\s+/,
          IDENT_RE$1,
          /(?=\()/
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          {
            // eat to avoid empty params
            begin: /\(\)/
          },
          PARAMS
        ]
      };
      const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
      const FUNCTION_VARIABLE = {
        match: [
          /const|var|let/,
          /\s+/,
          IDENT_RE$1,
          /\s*/,
          /=\s*/,
          /(async\s*)?/,
          // async is optional
          regex.lookahead(FUNC_LEAD_IN_RE)
        ],
        keywords: "async",
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          PARAMS
        ]
      };
      return {
        name: "Javascript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: KEYWORDS$1,
        // this will be extended by TypeScript
        exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
        illegal: /#(?![$_A-z])/,
        contains: [
          hljs.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
          }),
          USE_STRICT,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          HTML_TEMPLATE,
          CSS_TEMPLATE,
          TEMPLATE_STRING,
          COMMENT,
          NUMBER,
          CLASS_REFERENCE,
          {
            className: "attr",
            begin: IDENT_RE$1 + regex.lookahead(":"),
            relevance: 0
          },
          FUNCTION_VARIABLE,
          {
            // "value" container
            begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            relevance: 0,
            contains: [
              COMMENT,
              hljs.REGEXP_MODE,
              {
                className: "function",
                // we have to count the parens to make sure we actually have the
                // correct bounding ( ) before the =>.  There could be any number of
                // sub-expressions inside also surrounded by parens.
                begin: FUNC_LEAD_IN_RE,
                returnBegin: true,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      {
                        begin: hljs.UNDERSCORE_IDENT_RE,
                        relevance: 0
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: true
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS$1,
                        contains: PARAMS_CONTAINS
                      }
                    ]
                  }
                ]
              },
              {
                // could be a comma delimited list of params to a function call
                begin: /,/,
                relevance: 0
              },
              {
                match: /\s+/,
                relevance: 0
              },
              {
                // JSX
                variants: [
                  { begin: FRAGMENT.begin, end: FRAGMENT.end },
                  { match: XML_SELF_CLOSING },
                  {
                    begin: XML_TAG.begin,
                    // we carefully check the opening tag to see if it truly
                    // is a tag and not a false positive
                    "on:begin": XML_TAG.isTrulyOpeningTag,
                    end: XML_TAG.end
                  }
                ],
                subLanguage: "xml",
                contains: [
                  {
                    begin: XML_TAG.begin,
                    end: XML_TAG.end,
                    skip: true,
                    contains: ["self"]
                  }
                ]
              }
            ]
          },
          FUNCTION_DEFINITION,
          {
            // prevent this from getting swallowed up by function
            // since they appear "function like"
            beginKeywords: "while if switch catch for"
          },
          {
            // we have to count the parens to make sure we actually have the correct
            // bounding ( ).  There could be any number of sub-expressions inside
            // also surrounded by parens.
            begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
            // end parens
            returnBegin: true,
            label: "func.def",
            contains: [
              PARAMS,
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
            ]
          },
          // catch ... so it won't trigger the property rule below
          {
            match: /\.\.\./,
            relevance: 0
          },
          PROPERTY_ACCESS,
          // hack: prevents detection of keywords in some circumstances
          // .keyword()
          // $keyword = x
          {
            match: "\\$" + IDENT_RE$1,
            relevance: 0
          },
          {
            match: [/\bconstructor(?=\s*\()/],
            className: { 1: "title.function" },
            contains: [PARAMS]
          },
          FUNCTION_CALL,
          UPPER_CASE_CONSTANT,
          CLASS_OR_EXTENDS,
          GETTER_OR_SETTER,
          {
            match: /\$[(.]/
            // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
          }
        ]
      };
    }
    module.exports = javascript;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/json.js
var require_json = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/json.js"(exports, module) {
    function json(hljs) {
      const ATTRIBUTE = {
        className: "attr",
        begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
        relevance: 1.01
      };
      const PUNCTUATION = {
        match: /[{}[\],:]/,
        className: "punctuation",
        relevance: 0
      };
      const LITERALS = {
        beginKeywords: [
          "true",
          "false",
          "null"
        ].join(" ")
      };
      return {
        name: "JSON",
        contains: [
          ATTRIBUTE,
          PUNCTUATION,
          hljs.QUOTE_STRING_MODE,
          LITERALS,
          hljs.C_NUMBER_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ],
        illegal: "\\S"
      };
    }
    module.exports = json;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/kotlin.js
var require_kotlin = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/kotlin.js"(exports, module) {
    var decimalDigits = "[0-9](_*[0-9])*";
    var frac = `\\.(${decimalDigits})`;
    var hexDigits = "[0-9a-fA-F](_*[0-9a-fA-F])*";
    var NUMERIC = {
      className: "number",
      variants: [
        // DecimalFloatingPointLiteral
        // including ExponentPart
        { begin: `(\\b(${decimalDigits})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})[fFdD]?\\b` },
        // excluding ExponentPart
        { begin: `\\b(${decimalDigits})((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
        { begin: `(${frac})[fFdD]?\\b` },
        { begin: `\\b(${decimalDigits})[fFdD]\\b` },
        // HexadecimalFloatingPointLiteral
        { begin: `\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))[pP][+-]?(${decimalDigits})[fFdD]?\\b` },
        // DecimalIntegerLiteral
        { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
        // HexIntegerLiteral
        { begin: `\\b0[xX](${hexDigits})[lL]?\\b` },
        // OctalIntegerLiteral
        { begin: "\\b0(_*[0-7])*[lL]?\\b" },
        // BinaryIntegerLiteral
        { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
      ],
      relevance: 0
    };
    function kotlin(hljs) {
      const KEYWORDS = {
        keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
        built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
        literal: "true false null"
      };
      const KEYWORDS_WITH_LABEL = {
        className: "keyword",
        begin: /\b(break|continue|return|this)\b/,
        starts: {
          contains: [
            {
              className: "symbol",
              begin: /@\w+/
            }
          ]
        }
      };
      const LABEL = {
        className: "symbol",
        begin: hljs.UNDERSCORE_IDENT_RE + "@"
      };
      const SUBST = {
        className: "subst",
        begin: /\$\{/,
        end: /\}/,
        contains: [hljs.C_NUMBER_MODE]
      };
      const VARIABLE = {
        className: "variable",
        begin: "\\$" + hljs.UNDERSCORE_IDENT_RE
      };
      const STRING = {
        className: "string",
        variants: [
          {
            begin: '"""',
            end: '"""(?=[^"])',
            contains: [
              VARIABLE,
              SUBST
            ]
          },
          // Can't use built-in modes easily, as we want to use STRING in the meta
          // context as 'meta-string' and there's no syntax to remove explicitly set
          // classNames in built-in modes.
          {
            begin: "'",
            end: "'",
            illegal: /\n/,
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: '"',
            end: '"',
            illegal: /\n/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              VARIABLE,
              SUBST
            ]
          }
        ]
      };
      SUBST.contains.push(STRING);
      const ANNOTATION_USE_SITE = {
        className: "meta",
        begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + hljs.UNDERSCORE_IDENT_RE + ")?"
      };
      const ANNOTATION = {
        className: "meta",
        begin: "@" + hljs.UNDERSCORE_IDENT_RE,
        contains: [
          {
            begin: /\(/,
            end: /\)/,
            contains: [
              hljs.inherit(STRING, {
                className: "string"
              })
            ]
          }
        ]
      };
      const KOTLIN_NUMBER_MODE = NUMERIC;
      const KOTLIN_NESTED_COMMENT = hljs.COMMENT(
        "/\\*",
        "\\*/",
        {
          contains: [hljs.C_BLOCK_COMMENT_MODE]
        }
      );
      const KOTLIN_PAREN_TYPE = {
        variants: [
          {
            className: "type",
            begin: hljs.UNDERSCORE_IDENT_RE
          },
          {
            begin: /\(/,
            end: /\)/,
            contains: []
            // defined later
          }
        ]
      };
      const KOTLIN_PAREN_TYPE2 = KOTLIN_PAREN_TYPE;
      KOTLIN_PAREN_TYPE2.variants[1].contains = [KOTLIN_PAREN_TYPE];
      KOTLIN_PAREN_TYPE.variants[1].contains = [KOTLIN_PAREN_TYPE2];
      return {
        name: "Kotlin",
        aliases: ["kt", "kts"],
        keywords: KEYWORDS,
        contains: [
          hljs.COMMENT(
            "/\\*\\*",
            "\\*/",
            {
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                }
              ]
            }
          ),
          hljs.C_LINE_COMMENT_MODE,
          KOTLIN_NESTED_COMMENT,
          KEYWORDS_WITH_LABEL,
          LABEL,
          ANNOTATION_USE_SITE,
          ANNOTATION,
          {
            className: "function",
            beginKeywords: "fun",
            end: "[(]|$",
            returnBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            relevance: 5,
            contains: [
              {
                begin: hljs.UNDERSCORE_IDENT_RE + "\\s*\\(",
                returnBegin: true,
                relevance: 0,
                contains: [hljs.UNDERSCORE_TITLE_MODE]
              },
              {
                className: "type",
                begin: /</,
                end: />/,
                keywords: "reified",
                relevance: 0
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                endsParent: true,
                keywords: KEYWORDS,
                relevance: 0,
                contains: [
                  {
                    begin: /:/,
                    end: /[=,\/]/,
                    endsWithParent: true,
                    contains: [
                      KOTLIN_PAREN_TYPE,
                      hljs.C_LINE_COMMENT_MODE,
                      KOTLIN_NESTED_COMMENT
                    ],
                    relevance: 0
                  },
                  hljs.C_LINE_COMMENT_MODE,
                  KOTLIN_NESTED_COMMENT,
                  ANNOTATION_USE_SITE,
                  ANNOTATION,
                  STRING,
                  hljs.C_NUMBER_MODE
                ]
              },
              KOTLIN_NESTED_COMMENT
            ]
          },
          {
            className: "class",
            beginKeywords: "class interface trait",
            // remove 'trait' when removed from KEYWORDS
            end: /[:\{(]|$/,
            excludeEnd: true,
            illegal: "extends implements",
            contains: [
              {
                beginKeywords: "public protected internal private constructor"
              },
              hljs.UNDERSCORE_TITLE_MODE,
              {
                className: "type",
                begin: /</,
                end: />/,
                excludeBegin: true,
                excludeEnd: true,
                relevance: 0
              },
              {
                className: "type",
                begin: /[,:]\s*/,
                end: /[<\(,]|$/,
                excludeBegin: true,
                returnEnd: true
              },
              ANNOTATION_USE_SITE,
              ANNOTATION
            ]
          },
          STRING,
          {
            className: "meta",
            begin: "^#!/usr/bin/env",
            end: "$",
            illegal: "\n"
          },
          KOTLIN_NUMBER_MODE
        ]
      };
    }
    module.exports = kotlin;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/less.js
var require_less = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/less.js"(exports, module) {
    var MODES = (hljs) => {
      return {
        IMPORTANT: {
          scope: "meta",
          begin: "!important"
        },
        BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
        },
        FUNCTION_DISPATCH: {
          className: "built_in",
          begin: /[\w-]+(?=\()/
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z][A-Za-z0-9_-]*/
        }
      };
    };
    var TAGS = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "p",
      "q",
      "quote",
      "samp",
      "section",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video"
    ];
    var MEDIA_FEATURES = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      // TODO: find a better solution?
      "min-width",
      "max-width",
      "min-height",
      "max-height"
    ];
    var PSEUDO_CLASSES = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      // dir()
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      // has()
      "host",
      // host or host()
      "host-context",
      // host-context()
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      // is()
      "lang",
      // lang()
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      // not()
      "nth-child",
      // nth-child()
      "nth-col",
      // nth-col()
      "nth-last-child",
      // nth-last-child()
      "nth-last-col",
      // nth-last-col()
      "nth-last-of-type",
      //nth-last-of-type()
      "nth-of-type",
      //nth-of-type()
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where"
      // where()
    ];
    var PSEUDO_ELEMENTS = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error"
    ];
    var ATTRIBUTES = [
      "align-content",
      "align-items",
      "align-self",
      "all",
      "animation",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-timing-function",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-repeat",
      "background-size",
      "border",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-decoration-break",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "direction",
      "display",
      "empty-cells",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-size",
      "font-size-adjust",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-variant",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "gap",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "isolation",
      "justify-content",
      "left",
      "letter-spacing",
      "line-break",
      "line-height",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "max-height",
      "max-width",
      "min-height",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "padding",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "pointer-events",
      "position",
      "quotes",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "row-gap",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "speak",
      "speak-as",
      "src",
      // @font-face
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-style",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-transform",
      "text-underline-position",
      "top",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "unicode-bidi",
      "vertical-align",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "z-index"
      // reverse makes sure longer attributes `font-weight` are matched fully
      // instead of getting false positives on say `font`
    ].reverse();
    var PSEUDO_SELECTORS = PSEUDO_CLASSES.concat(PSEUDO_ELEMENTS);
    function less(hljs) {
      const modes = MODES(hljs);
      const PSEUDO_SELECTORS$1 = PSEUDO_SELECTORS;
      const AT_MODIFIERS = "and or not only";
      const IDENT_RE = "[\\w-]+";
      const INTERP_IDENT_RE = "(" + IDENT_RE + "|@\\{" + IDENT_RE + "\\})";
      const RULES = [];
      const VALUE_MODES = [];
      const STRING_MODE = function(c) {
        return {
          // Less strings are not multiline (also include '~' for more consistent coloring of "escaped" strings)
          className: "string",
          begin: "~?" + c + ".*?" + c
        };
      };
      const IDENT_MODE = function(name, begin, relevance) {
        return {
          className: name,
          begin,
          relevance
        };
      };
      const AT_KEYWORDS = {
        $pattern: /[a-z-]+/,
        keyword: AT_MODIFIERS,
        attribute: MEDIA_FEATURES.join(" ")
      };
      const PARENS_MODE = {
        // used only to properly balance nested parens inside mixin call, def. arg list
        begin: "\\(",
        end: "\\)",
        contains: VALUE_MODES,
        keywords: AT_KEYWORDS,
        relevance: 0
      };
      VALUE_MODES.push(
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        STRING_MODE("'"),
        STRING_MODE('"'),
        modes.CSS_NUMBER_MODE,
        // fixme: it does not include dot for numbers like .5em :(
        {
          begin: "(url|data-uri)\\(",
          starts: {
            className: "string",
            end: "[\\)\\n]",
            excludeEnd: true
          }
        },
        modes.HEXCOLOR,
        PARENS_MODE,
        IDENT_MODE("variable", "@@?" + IDENT_RE, 10),
        IDENT_MODE("variable", "@\\{" + IDENT_RE + "\\}"),
        IDENT_MODE("built_in", "~?`[^`]*?`"),
        // inline javascript (or whatever host language) *multiline* string
        {
          // @media features (it’s here to not duplicate things in AT_RULE_MODE with extra PARENS_MODE overriding):
          className: "attribute",
          begin: IDENT_RE + "\\s*:",
          end: ":",
          returnBegin: true,
          excludeEnd: true
        },
        modes.IMPORTANT
      );
      const VALUE_WITH_RULESETS = VALUE_MODES.concat({
        begin: /\{/,
        end: /\}/,
        contains: RULES
      });
      const MIXIN_GUARD_MODE = {
        beginKeywords: "when",
        endsWithParent: true,
        contains: [
          {
            beginKeywords: "and not"
          }
        ].concat(VALUE_MODES)
        // using this form to override VALUE’s 'function' match
      };
      const RULE_MODE = {
        begin: INTERP_IDENT_RE + "\\s*:",
        returnBegin: true,
        end: /[;}]/,
        relevance: 0,
        contains: [
          {
            begin: /-(webkit|moz|ms|o)-/
          },
          modes.CSS_VARIABLE,
          {
            className: "attribute",
            begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b",
            end: /(?=:)/,
            starts: {
              endsWithParent: true,
              illegal: "[<=$]",
              relevance: 0,
              contains: VALUE_MODES
            }
          }
        ]
      };
      const AT_RULE_MODE = {
        className: "keyword",
        begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
        starts: {
          end: "[;{}]",
          keywords: AT_KEYWORDS,
          returnEnd: true,
          contains: VALUE_MODES,
          relevance: 0
        }
      };
      const VAR_RULE_MODE = {
        className: "variable",
        variants: [
          // using more strict pattern for higher relevance to increase chances of Less detection.
          // this is *the only* Less specific statement used in most of the sources, so...
          // (we’ll still often loose to the css-parser unless there's '//' comment,
          // simply because 1 variable just can't beat 99 properties :)
          {
            begin: "@" + IDENT_RE + "\\s*:",
            relevance: 15
          },
          {
            begin: "@" + IDENT_RE
          }
        ],
        starts: {
          end: "[;}]",
          returnEnd: true,
          contains: VALUE_WITH_RULESETS
        }
      };
      const SELECTOR_MODE = {
        // first parse unambiguous selectors (i.e. those not starting with tag)
        // then fall into the scary lookahead-discriminator variant.
        // this mode also handles mixin definitions and calls
        variants: [
          {
            begin: "[\\.#:&\\[>]",
            end: "[;{}]"
            // mixin calls end with ';'
          },
          {
            begin: INTERP_IDENT_RE,
            end: /\{/
          }
        ],
        returnBegin: true,
        returnEnd: true,
        illegal: `[<='$"]`,
        relevance: 0,
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          MIXIN_GUARD_MODE,
          IDENT_MODE("keyword", "all\\b"),
          IDENT_MODE("variable", "@\\{" + IDENT_RE + "\\}"),
          // otherwise it’s identified as tag
          {
            begin: "\\b(" + TAGS.join("|") + ")\\b",
            className: "selector-tag"
          },
          modes.CSS_NUMBER_MODE,
          IDENT_MODE("selector-tag", INTERP_IDENT_RE, 0),
          IDENT_MODE("selector-id", "#" + INTERP_IDENT_RE),
          IDENT_MODE("selector-class", "\\." + INTERP_IDENT_RE, 0),
          IDENT_MODE("selector-tag", "&", 0),
          modes.ATTRIBUTE_SELECTOR_MODE,
          {
            className: "selector-pseudo",
            begin: ":(" + PSEUDO_CLASSES.join("|") + ")"
          },
          {
            className: "selector-pseudo",
            begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")"
          },
          {
            begin: /\(/,
            end: /\)/,
            relevance: 0,
            contains: VALUE_WITH_RULESETS
          },
          // argument list of parametric mixins
          {
            begin: "!important"
          },
          // eat !important after mixin call or it will be colored as tag
          modes.FUNCTION_DISPATCH
        ]
      };
      const PSEUDO_SELECTOR_MODE = {
        begin: IDENT_RE + `:(:)?(${PSEUDO_SELECTORS$1.join("|")})`,
        returnBegin: true,
        contains: [SELECTOR_MODE]
      };
      RULES.push(
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        AT_RULE_MODE,
        VAR_RULE_MODE,
        PSEUDO_SELECTOR_MODE,
        RULE_MODE,
        SELECTOR_MODE
      );
      return {
        name: "Less",
        case_insensitive: true,
        illegal: `[=>'/<($"]`,
        contains: RULES
      };
    }
    module.exports = less;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/lua.js
var require_lua = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/lua.js"(exports, module) {
    function lua(hljs) {
      const OPENING_LONG_BRACKET = "\\[=*\\[";
      const CLOSING_LONG_BRACKET = "\\]=*\\]";
      const LONG_BRACKETS = {
        begin: OPENING_LONG_BRACKET,
        end: CLOSING_LONG_BRACKET,
        contains: ["self"]
      };
      const COMMENTS = [
        hljs.COMMENT("--(?!" + OPENING_LONG_BRACKET + ")", "$"),
        hljs.COMMENT(
          "--" + OPENING_LONG_BRACKET,
          CLOSING_LONG_BRACKET,
          {
            contains: [LONG_BRACKETS],
            relevance: 10
          }
        )
      ];
      return {
        name: "Lua",
        keywords: {
          $pattern: hljs.UNDERSCORE_IDENT_RE,
          literal: "true false nil",
          keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
          built_in: (
            // Metatags and globals:
            "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
          )
        },
        contains: COMMENTS.concat([
          {
            className: "function",
            beginKeywords: "function",
            end: "\\)",
            contains: [
              hljs.inherit(hljs.TITLE_MODE, {
                begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
              }),
              {
                className: "params",
                begin: "\\(",
                endsWithParent: true,
                contains: COMMENTS
              }
            ].concat(COMMENTS)
          },
          hljs.C_NUMBER_MODE,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          {
            className: "string",
            begin: OPENING_LONG_BRACKET,
            end: CLOSING_LONG_BRACKET,
            contains: [LONG_BRACKETS],
            relevance: 5
          }
        ])
      };
    }
    module.exports = lua;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/makefile.js
var require_makefile = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/makefile.js"(exports, module) {
    function makefile(hljs) {
      const VARIABLE = {
        className: "variable",
        variants: [
          {
            begin: "\\$\\(" + hljs.UNDERSCORE_IDENT_RE + "\\)",
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: /\$[@%<?\^\+\*]/
          }
        ]
      };
      const QUOTE_STRING = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          VARIABLE
        ]
      };
      const FUNC = {
        className: "variable",
        begin: /\$\([\w-]+\s/,
        end: /\)/,
        keywords: {
          built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
        },
        contains: [VARIABLE]
      };
      const ASSIGNMENT = {
        begin: "^" + hljs.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)"
      };
      const META = {
        className: "meta",
        begin: /^\.PHONY:/,
        end: /$/,
        keywords: {
          $pattern: /[\.\w]+/,
          keyword: ".PHONY"
        }
      };
      const TARGET = {
        className: "section",
        begin: /^[^\s]+:/,
        end: /$/,
        contains: [VARIABLE]
      };
      return {
        name: "Makefile",
        aliases: [
          "mk",
          "mak",
          "make"
        ],
        keywords: {
          $pattern: /[\w-]+/,
          keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
        },
        contains: [
          hljs.HASH_COMMENT_MODE,
          VARIABLE,
          QUOTE_STRING,
          FUNC,
          ASSIGNMENT,
          META,
          TARGET
        ]
      };
    }
    module.exports = makefile;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/perl.js
var require_perl = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/perl.js"(exports, module) {
    function perl(hljs) {
      const regex = hljs.regex;
      const KEYWORDS = [
        "abs",
        "accept",
        "alarm",
        "and",
        "atan2",
        "bind",
        "binmode",
        "bless",
        "break",
        "caller",
        "chdir",
        "chmod",
        "chomp",
        "chop",
        "chown",
        "chr",
        "chroot",
        "close",
        "closedir",
        "connect",
        "continue",
        "cos",
        "crypt",
        "dbmclose",
        "dbmopen",
        "defined",
        "delete",
        "die",
        "do",
        "dump",
        "each",
        "else",
        "elsif",
        "endgrent",
        "endhostent",
        "endnetent",
        "endprotoent",
        "endpwent",
        "endservent",
        "eof",
        "eval",
        "exec",
        "exists",
        "exit",
        "exp",
        "fcntl",
        "fileno",
        "flock",
        "for",
        "foreach",
        "fork",
        "format",
        "formline",
        "getc",
        "getgrent",
        "getgrgid",
        "getgrnam",
        "gethostbyaddr",
        "gethostbyname",
        "gethostent",
        "getlogin",
        "getnetbyaddr",
        "getnetbyname",
        "getnetent",
        "getpeername",
        "getpgrp",
        "getpriority",
        "getprotobyname",
        "getprotobynumber",
        "getprotoent",
        "getpwent",
        "getpwnam",
        "getpwuid",
        "getservbyname",
        "getservbyport",
        "getservent",
        "getsockname",
        "getsockopt",
        "given",
        "glob",
        "gmtime",
        "goto",
        "grep",
        "gt",
        "hex",
        "if",
        "index",
        "int",
        "ioctl",
        "join",
        "keys",
        "kill",
        "last",
        "lc",
        "lcfirst",
        "length",
        "link",
        "listen",
        "local",
        "localtime",
        "log",
        "lstat",
        "lt",
        "ma",
        "map",
        "mkdir",
        "msgctl",
        "msgget",
        "msgrcv",
        "msgsnd",
        "my",
        "ne",
        "next",
        "no",
        "not",
        "oct",
        "open",
        "opendir",
        "or",
        "ord",
        "our",
        "pack",
        "package",
        "pipe",
        "pop",
        "pos",
        "print",
        "printf",
        "prototype",
        "push",
        "q|0",
        "qq",
        "quotemeta",
        "qw",
        "qx",
        "rand",
        "read",
        "readdir",
        "readline",
        "readlink",
        "readpipe",
        "recv",
        "redo",
        "ref",
        "rename",
        "require",
        "reset",
        "return",
        "reverse",
        "rewinddir",
        "rindex",
        "rmdir",
        "say",
        "scalar",
        "seek",
        "seekdir",
        "select",
        "semctl",
        "semget",
        "semop",
        "send",
        "setgrent",
        "sethostent",
        "setnetent",
        "setpgrp",
        "setpriority",
        "setprotoent",
        "setpwent",
        "setservent",
        "setsockopt",
        "shift",
        "shmctl",
        "shmget",
        "shmread",
        "shmwrite",
        "shutdown",
        "sin",
        "sleep",
        "socket",
        "socketpair",
        "sort",
        "splice",
        "split",
        "sprintf",
        "sqrt",
        "srand",
        "stat",
        "state",
        "study",
        "sub",
        "substr",
        "symlink",
        "syscall",
        "sysopen",
        "sysread",
        "sysseek",
        "system",
        "syswrite",
        "tell",
        "telldir",
        "tie",
        "tied",
        "time",
        "times",
        "tr",
        "truncate",
        "uc",
        "ucfirst",
        "umask",
        "undef",
        "unless",
        "unlink",
        "unpack",
        "unshift",
        "untie",
        "until",
        "use",
        "utime",
        "values",
        "vec",
        "wait",
        "waitpid",
        "wantarray",
        "warn",
        "when",
        "while",
        "write",
        "x|0",
        "xor",
        "y|0"
      ];
      const REGEX_MODIFIERS = /[dualxmsipngr]{0,12}/;
      const PERL_KEYWORDS = {
        $pattern: /[\w.]+/,
        keyword: KEYWORDS.join(" ")
      };
      const SUBST = {
        className: "subst",
        begin: "[$@]\\{",
        end: "\\}",
        keywords: PERL_KEYWORDS
      };
      const METHOD = {
        begin: /->\{/,
        end: /\}/
        // contains defined later
      };
      const VAR = {
        variants: [
          {
            begin: /\$\d/
          },
          {
            begin: regex.concat(
              /[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,
              // negative look-ahead tries to avoid matching patterns that are not
              // Perl at all like $ident$, @ident@, etc.
              `(?![A-Za-z])(?![@$%])`
            )
          },
          {
            begin: /[$%@][^\s\w{]/,
            relevance: 0
          }
        ]
      };
      const STRING_CONTAINS = [
        hljs.BACKSLASH_ESCAPE,
        SUBST,
        VAR
      ];
      const REGEX_DELIMS = [
        /!/,
        /\//,
        /\|/,
        /\?/,
        /'/,
        /"/,
        // valid but infrequent and weird
        /#/
        // valid but infrequent and weird
      ];
      const PAIRED_DOUBLE_RE = (prefix, open, close = "\\1") => {
        const middle = close === "\\1" ? close : regex.concat(close, open);
        return regex.concat(
          regex.concat("(?:", prefix, ")"),
          open,
          /(?:\\.|[^\\\/])*?/,
          middle,
          /(?:\\.|[^\\\/])*?/,
          close,
          REGEX_MODIFIERS
        );
      };
      const PAIRED_RE = (prefix, open, close) => {
        return regex.concat(
          regex.concat("(?:", prefix, ")"),
          open,
          /(?:\\.|[^\\\/])*?/,
          close,
          REGEX_MODIFIERS
        );
      };
      const PERL_DEFAULT_CONTAINS = [
        VAR,
        hljs.HASH_COMMENT_MODE,
        hljs.COMMENT(
          /^=\w/,
          /=cut/,
          {
            endsWithParent: true
          }
        ),
        METHOD,
        {
          className: "string",
          contains: STRING_CONTAINS,
          variants: [
            {
              begin: "q[qwxr]?\\s*\\(",
              end: "\\)",
              relevance: 5
            },
            {
              begin: "q[qwxr]?\\s*\\[",
              end: "\\]",
              relevance: 5
            },
            {
              begin: "q[qwxr]?\\s*\\{",
              end: "\\}",
              relevance: 5
            },
            {
              begin: "q[qwxr]?\\s*\\|",
              end: "\\|",
              relevance: 5
            },
            {
              begin: "q[qwxr]?\\s*<",
              end: ">",
              relevance: 5
            },
            {
              begin: "qw\\s+q",
              end: "q",
              relevance: 5
            },
            {
              begin: "'",
              end: "'",
              contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
              begin: '"',
              end: '"'
            },
            {
              begin: "`",
              end: "`",
              contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
              begin: /\{\w+\}/,
              relevance: 0
            },
            {
              begin: "-?\\w+\\s*=>",
              relevance: 0
            }
          ]
        },
        {
          className: "number",
          begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
          relevance: 0
        },
        {
          // regexp container
          begin: "(\\/\\/|" + hljs.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
          keywords: "split return print reverse grep",
          relevance: 0,
          contains: [
            hljs.HASH_COMMENT_MODE,
            {
              className: "regexp",
              variants: [
                // allow matching common delimiters
                { begin: PAIRED_DOUBLE_RE("s|tr|y", regex.either(...REGEX_DELIMS, { capture: true })) },
                // and then paired delmis
                { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\(", "\\)") },
                { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\[", "\\]") },
                { begin: PAIRED_DOUBLE_RE("s|tr|y", "\\{", "\\}") }
              ],
              relevance: 2
            },
            {
              className: "regexp",
              variants: [
                {
                  // could be a comment in many languages so do not count
                  // as relevant
                  begin: /(m|qr)\/\//,
                  relevance: 0
                },
                // prefix is optional with /regex/
                { begin: PAIRED_RE("(?:m|qr)?", /\//, /\//) },
                // allow matching common delimiters
                { begin: PAIRED_RE("m|qr", regex.either(...REGEX_DELIMS, { capture: true }), /\1/) },
                // allow common paired delmins
                { begin: PAIRED_RE("m|qr", /\(/, /\)/) },
                { begin: PAIRED_RE("m|qr", /\[/, /\]/) },
                { begin: PAIRED_RE("m|qr", /\{/, /\}/) }
              ]
            }
          ]
        },
        {
          className: "function",
          beginKeywords: "sub",
          end: "(\\s*\\(.*?\\))?[;{]",
          excludeEnd: true,
          relevance: 5,
          contains: [hljs.TITLE_MODE]
        },
        {
          begin: "-\\w\\b",
          relevance: 0
        },
        {
          begin: "^__DATA__$",
          end: "^__END__$",
          subLanguage: "mojolicious",
          contains: [
            {
              begin: "^@@.*",
              end: "$",
              className: "comment"
            }
          ]
        }
      ];
      SUBST.contains = PERL_DEFAULT_CONTAINS;
      METHOD.contains = PERL_DEFAULT_CONTAINS;
      return {
        name: "Perl",
        aliases: [
          "pl",
          "pm"
        ],
        keywords: PERL_KEYWORDS,
        contains: PERL_DEFAULT_CONTAINS
      };
    }
    module.exports = perl;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/objectivec.js
var require_objectivec = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/objectivec.js"(exports, module) {
    function objectivec(hljs) {
      const API_CLASS = {
        className: "built_in",
        begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
      };
      const IDENTIFIER_RE = /[a-zA-Z@][a-zA-Z0-9_]*/;
      const KWS = [
        "int",
        "float",
        "while",
        "char",
        "export",
        "sizeof",
        "typedef",
        "const",
        "struct",
        "for",
        "union",
        "unsigned",
        "long",
        "volatile",
        "static",
        "bool",
        "mutable",
        "if",
        "do",
        "return",
        "goto",
        "void",
        "enum",
        "else",
        "break",
        "extern",
        "asm",
        "case",
        "short",
        "default",
        "double",
        "register",
        "explicit",
        "signed",
        "typename",
        "this",
        "switch",
        "continue",
        "wchar_t",
        "inline",
        "readonly",
        "assign",
        "readwrite",
        "self",
        "@synchronized",
        "id",
        "typeof",
        "nonatomic",
        "super",
        "unichar",
        "IBOutlet",
        "IBAction",
        "strong",
        "weak",
        "copy",
        "in",
        "out",
        "inout",
        "bycopy",
        "byref",
        "oneway",
        "__strong",
        "__weak",
        "__block",
        "__autoreleasing",
        "@private",
        "@protected",
        "@public",
        "@try",
        "@property",
        "@end",
        "@throw",
        "@catch",
        "@finally",
        "@autoreleasepool",
        "@synthesize",
        "@dynamic",
        "@selector",
        "@optional",
        "@required",
        "@encode",
        "@package",
        "@import",
        "@defs",
        "@compatibility_alias",
        "__bridge",
        "__bridge_transfer",
        "__bridge_retained",
        "__bridge_retain",
        "__covariant",
        "__contravariant",
        "__kindof",
        "_Nonnull",
        "_Nullable",
        "_Null_unspecified",
        "__FUNCTION__",
        "__PRETTY_FUNCTION__",
        "__attribute__",
        "getter",
        "setter",
        "retain",
        "unsafe_unretained",
        "nonnull",
        "nullable",
        "null_unspecified",
        "null_resettable",
        "class",
        "instancetype",
        "NS_DESIGNATED_INITIALIZER",
        "NS_UNAVAILABLE",
        "NS_REQUIRES_SUPER",
        "NS_RETURNS_INNER_POINTER",
        "NS_INLINE",
        "NS_AVAILABLE",
        "NS_DEPRECATED",
        "NS_ENUM",
        "NS_OPTIONS",
        "NS_SWIFT_UNAVAILABLE",
        "NS_ASSUME_NONNULL_BEGIN",
        "NS_ASSUME_NONNULL_END",
        "NS_REFINED_FOR_SWIFT",
        "NS_SWIFT_NAME",
        "NS_SWIFT_NOTHROW",
        "NS_DURING",
        "NS_HANDLER",
        "NS_ENDHANDLER",
        "NS_VALUERETURN",
        "NS_VOIDRETURN"
      ];
      const LITERALS = [
        "false",
        "true",
        "FALSE",
        "TRUE",
        "nil",
        "YES",
        "NO",
        "NULL"
      ];
      const BUILT_INS = [
        "BOOL",
        "dispatch_once_t",
        "dispatch_queue_t",
        "dispatch_sync",
        "dispatch_async",
        "dispatch_once"
      ];
      const KEYWORDS = {
        $pattern: IDENTIFIER_RE,
        keyword: KWS,
        literal: LITERALS,
        built_in: BUILT_INS
      };
      const CLASS_KEYWORDS = {
        $pattern: IDENTIFIER_RE,
        keyword: [
          "@interface",
          "@class",
          "@protocol",
          "@implementation"
        ]
      };
      return {
        name: "Objective-C",
        aliases: [
          "mm",
          "objc",
          "obj-c",
          "obj-c++",
          "objective-c++"
        ],
        keywords: KEYWORDS,
        illegal: "</",
        contains: [
          API_CLASS,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          {
            className: "string",
            variants: [
              {
                begin: '@"',
                end: '"',
                illegal: "\\n",
                contains: [hljs.BACKSLASH_ESCAPE]
              }
            ]
          },
          {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include"
            },
            contains: [
              {
                begin: /\\\n/,
                relevance: 0
              },
              hljs.inherit(hljs.QUOTE_STRING_MODE, {
                className: "string"
              }),
              {
                className: "string",
                begin: /<.*?>/,
                end: /$/,
                illegal: "\\n"
              },
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          {
            className: "class",
            begin: "(" + CLASS_KEYWORDS.keyword.join("|") + ")\\b",
            end: /(\{|$)/,
            excludeEnd: true,
            keywords: CLASS_KEYWORDS,
            contains: [hljs.UNDERSCORE_TITLE_MODE]
          },
          {
            begin: "\\." + hljs.UNDERSCORE_IDENT_RE,
            relevance: 0
          }
        ]
      };
    }
    module.exports = objectivec;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/php.js
var require_php = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/php.js"(exports, module) {
    function php(hljs) {
      const regex = hljs.regex;
      const IDENT_RE_CORE = "[a-zA-Z0-9_-ÿ]*(?![A-Za-z0-9])(?![$]))";
      const IDENT_RE = regex.concat("([a-zA-Z_\\x7f-\\xff]", IDENT_RE_CORE);
      const PASCAL_CASE_CLASS_NAME_RE = regex.concat("([A-Z]", IDENT_RE_CORE);
      const VARIABLE = {
        scope: "variable",
        match: "\\$+" + IDENT_RE
      };
      const PREPROCESSOR = {
        scope: "meta",
        variants: [
          { begin: /<\?php/, relevance: 10 },
          // boost for obvious PHP
          { begin: /<\?[=]?/ },
          { begin: /\?>/ }
          // end php tag
        ]
      };
      const SUBST = {
        scope: "subst",
        variants: [
          { begin: /\$\w+/ },
          { begin: /\{\$/, end: /\}/ }
        ]
      };
      const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, {
        illegal: null
      });
      const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
        illegal: null,
        contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
      });
      const HEREDOC = hljs.END_SAME_AS_BEGIN({
        begin: /<<<[ \t]*(\w+)\n/,
        end: /[ \t]*(\w+)\b/,
        contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
      });
      const WHITESPACE = "[ 	\n]";
      const STRING = {
        scope: "string",
        variants: [
          DOUBLE_QUOTED,
          SINGLE_QUOTED,
          HEREDOC
        ]
      };
      const NUMBER = {
        scope: "number",
        variants: [
          { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
          // Binary w/ underscore support
          { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
          // Octals w/ underscore support
          { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
          // Hex w/ underscore support
          // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
          { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
        ],
        relevance: 0
      };
      const LITERALS = [
        "false",
        "null",
        "true"
      ];
      const KWS = [
        // Magic constants:
        // <https://www.php.net/manual/en/language.constants.predefined.php>
        "__CLASS__",
        "__DIR__",
        "__FILE__",
        "__FUNCTION__",
        "__COMPILER_HALT_OFFSET__",
        "__LINE__",
        "__METHOD__",
        "__NAMESPACE__",
        "__TRAIT__",
        // Function that look like language construct or language construct that look like function:
        // List of keywords that may not require parenthesis
        "die",
        "echo",
        "exit",
        "include",
        "include_once",
        "print",
        "require",
        "require_once",
        // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
        // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
        // Other keywords:
        // <https://www.php.net/manual/en/reserved.php>
        // <https://www.php.net/manual/en/language.types.type-juggling.php>
        "array",
        "abstract",
        "and",
        "as",
        "binary",
        "bool",
        "boolean",
        "break",
        "callable",
        "case",
        "catch",
        "class",
        "clone",
        "const",
        "continue",
        "declare",
        "default",
        "do",
        "double",
        "else",
        "elseif",
        "empty",
        "enddeclare",
        "endfor",
        "endforeach",
        "endif",
        "endswitch",
        "endwhile",
        "enum",
        "eval",
        "extends",
        "final",
        "finally",
        "float",
        "for",
        "foreach",
        "from",
        "global",
        "goto",
        "if",
        "implements",
        "instanceof",
        "insteadof",
        "int",
        "integer",
        "interface",
        "isset",
        "iterable",
        "list",
        "match|0",
        "mixed",
        "new",
        "never",
        "object",
        "or",
        "private",
        "protected",
        "public",
        "readonly",
        "real",
        "return",
        "string",
        "switch",
        "throw",
        "trait",
        "try",
        "unset",
        "use",
        "var",
        "void",
        "while",
        "xor",
        "yield"
      ];
      const BUILT_INS = [
        // Standard PHP library:
        // <https://www.php.net/manual/en/book.spl.php>
        "Error|0",
        "AppendIterator",
        "ArgumentCountError",
        "ArithmeticError",
        "ArrayIterator",
        "ArrayObject",
        "AssertionError",
        "BadFunctionCallException",
        "BadMethodCallException",
        "CachingIterator",
        "CallbackFilterIterator",
        "CompileError",
        "Countable",
        "DirectoryIterator",
        "DivisionByZeroError",
        "DomainException",
        "EmptyIterator",
        "ErrorException",
        "Exception",
        "FilesystemIterator",
        "FilterIterator",
        "GlobIterator",
        "InfiniteIterator",
        "InvalidArgumentException",
        "IteratorIterator",
        "LengthException",
        "LimitIterator",
        "LogicException",
        "MultipleIterator",
        "NoRewindIterator",
        "OutOfBoundsException",
        "OutOfRangeException",
        "OuterIterator",
        "OverflowException",
        "ParentIterator",
        "ParseError",
        "RangeException",
        "RecursiveArrayIterator",
        "RecursiveCachingIterator",
        "RecursiveCallbackFilterIterator",
        "RecursiveDirectoryIterator",
        "RecursiveFilterIterator",
        "RecursiveIterator",
        "RecursiveIteratorIterator",
        "RecursiveRegexIterator",
        "RecursiveTreeIterator",
        "RegexIterator",
        "RuntimeException",
        "SeekableIterator",
        "SplDoublyLinkedList",
        "SplFileInfo",
        "SplFileObject",
        "SplFixedArray",
        "SplHeap",
        "SplMaxHeap",
        "SplMinHeap",
        "SplObjectStorage",
        "SplObserver",
        "SplPriorityQueue",
        "SplQueue",
        "SplStack",
        "SplSubject",
        "SplTempFileObject",
        "TypeError",
        "UnderflowException",
        "UnexpectedValueException",
        "UnhandledMatchError",
        // Reserved interfaces:
        // <https://www.php.net/manual/en/reserved.interfaces.php>
        "ArrayAccess",
        "BackedEnum",
        "Closure",
        "Fiber",
        "Generator",
        "Iterator",
        "IteratorAggregate",
        "Serializable",
        "Stringable",
        "Throwable",
        "Traversable",
        "UnitEnum",
        "WeakReference",
        "WeakMap",
        // Reserved classes:
        // <https://www.php.net/manual/en/reserved.classes.php>
        "Directory",
        "__PHP_Incomplete_Class",
        "parent",
        "php_user_filter",
        "self",
        "static",
        "stdClass"
      ];
      const dualCase = (items) => {
        const result = [];
        items.forEach((item) => {
          result.push(item);
          if (item.toLowerCase() === item) {
            result.push(item.toUpperCase());
          } else {
            result.push(item.toLowerCase());
          }
        });
        return result;
      };
      const KEYWORDS = {
        keyword: KWS,
        literal: dualCase(LITERALS),
        built_in: BUILT_INS
      };
      const normalizeKeywords = (items) => {
        return items.map((item) => {
          return item.replace(/\|\d+$/, "");
        });
      };
      const CONSTRUCTOR_CALL = {
        variants: [
          {
            match: [
              /new/,
              regex.concat(WHITESPACE, "+"),
              // to prevent built ins from being confused as the class constructor call
              regex.concat("(?!", normalizeKeywords(BUILT_INS).join("\\b|"), "\\b)"),
              regex.concat(/\\?/, IDENT_RE),
              regex.concat(WHITESPACE, "*", /\(/)
            ],
            scope: {
              1: "keyword",
              4: "title.class"
            }
          }
        ]
      };
      const FUNCTION_INVOKE = {
        relevance: 0,
        match: [
          /\b/,
          // to prevent keywords from being confused as the function title
          regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS).join("\\b|"), "\\b)"),
          IDENT_RE,
          regex.concat(WHITESPACE, "*"),
          regex.lookahead(/(?=\()/)
        ],
        scope: {
          3: "title.function.invoke"
        }
      };
      const CONSTANT_REFERENCE = regex.concat(IDENT_RE, "\\b(?!\\()");
      const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = {
        variants: [
          {
            match: [
              regex.concat(
                /::/,
                regex.lookahead(/(?!class\b)/)
              ),
              CONSTANT_REFERENCE
            ],
            scope: {
              2: "variable.constant"
            }
          },
          {
            match: [
              /::/,
              /class/
            ],
            scope: {
              2: "variable.language"
            }
          },
          {
            match: [
              PASCAL_CASE_CLASS_NAME_RE,
              regex.concat(
                "::",
                regex.lookahead(/(?!class\b)/)
              )
            ],
            scope: {
              1: "title.class"
            }
          },
          {
            match: [
              PASCAL_CASE_CLASS_NAME_RE,
              /::/,
              /class/
            ],
            scope: {
              1: "title.class",
              3: "variable.language"
            }
          }
        ]
      };
      return {
        case_insensitive: false,
        keywords: KEYWORDS,
        contains: [
          hljs.HASH_COMMENT_MODE,
          hljs.COMMENT("//", "$"),
          hljs.COMMENT(
            "/\\*",
            "\\*/",
            {
              contains: [
                {
                  scope: "doctag",
                  match: "@[A-Za-z]+"
                }
              ]
            }
          ),
          {
            match: /__halt_compiler\(\);/,
            keywords: "__halt_compiler",
            starts: {
              scope: "comment",
              end: hljs.MATCH_NOTHING_RE,
              contains: [
                {
                  match: /\?>/,
                  scope: "meta",
                  endsParent: true
                }
              ]
            }
          },
          PREPROCESSOR,
          {
            scope: "variable.language",
            match: /\$this\b/
          },
          VARIABLE,
          FUNCTION_INVOKE,
          LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
          {
            match: [
              /const/,
              /\s/,
              IDENT_RE,
              /\s*=/
            ],
            scope: {
              1: "keyword",
              3: "variable.constant"
            }
          },
          CONSTRUCTOR_CALL,
          {
            scope: "function",
            relevance: 0,
            beginKeywords: "fn function",
            end: /[;{]/,
            excludeEnd: true,
            illegal: "[$%\\[]",
            contains: [
              {
                beginKeywords: "use"
              },
              hljs.UNDERSCORE_TITLE_MODE,
              {
                begin: "=>",
                // No markup, just a relevance booster
                endsParent: true
              },
              {
                scope: "params",
                begin: "\\(",
                end: "\\)",
                excludeBegin: true,
                excludeEnd: true,
                keywords: KEYWORDS,
                contains: [
                  "self",
                  VARIABLE,
                  LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
                  hljs.C_BLOCK_COMMENT_MODE,
                  STRING,
                  NUMBER
                ]
              }
            ]
          },
          {
            scope: "class",
            variants: [
              { beginKeywords: "enum", illegal: /[($"]/ },
              { beginKeywords: "class interface trait", illegal: /[:($"]/ }
            ],
            relevance: 0,
            end: /\{/,
            excludeEnd: true,
            contains: [
              { beginKeywords: "extends implements" },
              hljs.UNDERSCORE_TITLE_MODE
            ]
          },
          // both use and namespace still use "old style" rules (vs multi-match)
          // because the namespace name can include `\` and we still want each
          // element to be treated as its own *individual* title
          {
            beginKeywords: "namespace",
            relevance: 0,
            end: ";",
            illegal: /[.']/,
            contains: [
              hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })
            ]
          },
          {
            beginKeywords: "use",
            relevance: 0,
            end: ";",
            contains: [
              // TODO: title.function vs title.class
              {
                match: /\b(as|const|function)\b/,
                scope: "keyword"
              },
              // TODO: could be title.class or title.function
              hljs.UNDERSCORE_TITLE_MODE
            ]
          },
          STRING,
          NUMBER
        ]
      };
    }
    module.exports = php;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/php-template.js
var require_php_template = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/php-template.js"(exports, module) {
    function phpTemplate(hljs) {
      return {
        name: "PHP template",
        subLanguage: "xml",
        contains: [
          {
            begin: /<\?(php|=)?/,
            end: /\?>/,
            subLanguage: "php",
            contains: [
              // We don't want the php closing tag ?> to close the PHP block when
              // inside any of the following blocks:
              {
                begin: "/\\*",
                end: "\\*/",
                skip: true
              },
              {
                begin: 'b"',
                end: '"',
                skip: true
              },
              {
                begin: "b'",
                end: "'",
                skip: true
              },
              hljs.inherit(hljs.APOS_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: true
              }),
              hljs.inherit(hljs.QUOTE_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: true
              })
            ]
          }
        ]
      };
    }
    module.exports = phpTemplate;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/plaintext.js
var require_plaintext = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/plaintext.js"(exports, module) {
    function plaintext(hljs) {
      return {
        name: "Plain text",
        aliases: [
          "text",
          "txt"
        ],
        disableAutodetect: true
      };
    }
    module.exports = plaintext;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/python.js
var require_python = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/python.js"(exports, module) {
    function python(hljs) {
      const regex = hljs.regex;
      const IDENT_RE = new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*", "u");
      const RESERVED_WORDS = [
        "and",
        "as",
        "assert",
        "async",
        "await",
        "break",
        "class",
        "continue",
        "def",
        "del",
        "elif",
        "else",
        "except",
        "finally",
        "for",
        "from",
        "global",
        "if",
        "import",
        "in",
        "is",
        "lambda",
        "nonlocal|10",
        "not",
        "or",
        "pass",
        "raise",
        "return",
        "try",
        "while",
        "with",
        "yield"
      ];
      const BUILT_INS = [
        "__import__",
        "abs",
        "all",
        "any",
        "ascii",
        "bin",
        "bool",
        "breakpoint",
        "bytearray",
        "bytes",
        "callable",
        "chr",
        "classmethod",
        "compile",
        "complex",
        "delattr",
        "dict",
        "dir",
        "divmod",
        "enumerate",
        "eval",
        "exec",
        "filter",
        "float",
        "format",
        "frozenset",
        "getattr",
        "globals",
        "hasattr",
        "hash",
        "help",
        "hex",
        "id",
        "input",
        "int",
        "isinstance",
        "issubclass",
        "iter",
        "len",
        "list",
        "locals",
        "map",
        "max",
        "memoryview",
        "min",
        "next",
        "object",
        "oct",
        "open",
        "ord",
        "pow",
        "print",
        "property",
        "range",
        "repr",
        "reversed",
        "round",
        "set",
        "setattr",
        "slice",
        "sorted",
        "staticmethod",
        "str",
        "sum",
        "super",
        "tuple",
        "type",
        "vars",
        "zip"
      ];
      const LITERALS = [
        "__debug__",
        "Ellipsis",
        "False",
        "None",
        "NotImplemented",
        "True"
      ];
      const TYPES = [
        "Any",
        "Callable",
        "Coroutine",
        "Dict",
        "List",
        "Literal",
        "Generic",
        "Optional",
        "Sequence",
        "Set",
        "Tuple",
        "Type",
        "Union"
      ];
      const KEYWORDS = {
        $pattern: /[A-Za-z]\w+|__\w+__/,
        keyword: RESERVED_WORDS,
        built_in: BUILT_INS,
        literal: LITERALS,
        type: TYPES
      };
      const PROMPT = {
        className: "meta",
        begin: /^(>>>|\.\.\.) /
      };
      const SUBST = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS,
        illegal: /#/
      };
      const LITERAL_BRACKET = {
        begin: /\{\{/,
        relevance: 0
      };
      const STRING = {
        className: "string",
        contains: [hljs.BACKSLASH_ESCAPE],
        variants: [
          {
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
            end: /'''/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT
            ],
            relevance: 10
          },
          {
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
            end: /"""/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT
            ],
            relevance: 10
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])'''/,
            end: /'''/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])"""/,
            end: /"""/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              PROMPT,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([uU]|[rR])'/,
            end: /'/,
            relevance: 10
          },
          {
            begin: /([uU]|[rR])"/,
            end: /"/,
            relevance: 10
          },
          {
            begin: /([bB]|[bB][rR]|[rR][bB])'/,
            end: /'/
          },
          {
            begin: /([bB]|[bB][rR]|[rR][bB])"/,
            end: /"/
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])'/,
            end: /'/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          {
            begin: /([fF][rR]|[rR][fF]|[fF])"/,
            end: /"/,
            contains: [
              hljs.BACKSLASH_ESCAPE,
              LITERAL_BRACKET,
              SUBST
            ]
          },
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      };
      const digitpart = "[0-9](_?[0-9])*";
      const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
      const lookahead = `\\b|${RESERVED_WORDS.join("|")}`;
      const NUMBER = {
        className: "number",
        relevance: 0,
        variants: [
          // exponentfloat, pointfloat
          // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
          // optionally imaginary
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          // Note: no leading \b because floats can start with a decimal point
          // and we don't want to mishandle e.g. `fn(.5)`,
          // no trailing \b for pointfloat because it can end with a decimal point
          // and we don't want to mishandle e.g. `0..hex()`; this should be safe
          // because both MUST contain a decimal point and so cannot be confused with
          // the interior part of an identifier
          {
            begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
          },
          {
            begin: `(${pointfloat})[jJ]?`
          },
          // decinteger, bininteger, octinteger, hexinteger
          // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
          // optionally "long" in Python 2
          // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
          // decinteger is optionally imaginary
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          {
            begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
          },
          {
            begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
          },
          {
            begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
          },
          {
            begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
          },
          // imagnumber (digitpart-based)
          // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
          {
            begin: `\\b(${digitpart})[jJ](?=${lookahead})`
          }
        ]
      };
      const COMMENT_TYPE = {
        className: "comment",
        begin: regex.lookahead(/# type:/),
        end: /$/,
        keywords: KEYWORDS,
        contains: [
          {
            // prevent keywords from coloring `type`
            begin: /# type:/
          },
          // comment within a datatype comment includes no keywords
          {
            begin: /#/,
            end: /\b\B/,
            endsWithParent: true
          }
        ]
      };
      const PARAMS = {
        className: "params",
        variants: [
          // Exclude params in functions without params
          {
            className: "",
            begin: /\(\s*\)/,
            skip: true
          },
          {
            begin: /\(/,
            end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            contains: [
              "self",
              PROMPT,
              NUMBER,
              STRING,
              hljs.HASH_COMMENT_MODE
            ]
          }
        ]
      };
      SUBST.contains = [
        STRING,
        NUMBER,
        PROMPT
      ];
      return {
        name: "Python",
        aliases: [
          "py",
          "gyp",
          "ipython"
        ],
        unicodeRegex: true,
        keywords: KEYWORDS,
        illegal: /(<\/|->|\?)|=>/,
        contains: [
          PROMPT,
          NUMBER,
          {
            // very common convention
            begin: /\bself\b/
          },
          {
            // eat "if" prior to string so that it won't accidentally be
            // labeled as an f-string
            beginKeywords: "if",
            relevance: 0
          },
          STRING,
          COMMENT_TYPE,
          hljs.HASH_COMMENT_MODE,
          {
            match: [
              /\bdef/,
              /\s+/,
              IDENT_RE
            ],
            scope: {
              1: "keyword",
              3: "title.function"
            },
            contains: [PARAMS]
          },
          {
            variants: [
              {
                match: [
                  /\bclass/,
                  /\s+/,
                  IDENT_RE,
                  /\s*/,
                  /\(\s*/,
                  IDENT_RE,
                  /\s*\)/
                ]
              },
              {
                match: [
                  /\bclass/,
                  /\s+/,
                  IDENT_RE
                ]
              }
            ],
            scope: {
              1: "keyword",
              3: "title.class",
              6: "title.class.inherited"
            }
          },
          {
            className: "meta",
            begin: /^[\t ]*@/,
            end: /(?=#)|$/,
            contains: [
              NUMBER,
              PARAMS,
              STRING
            ]
          }
        ]
      };
    }
    module.exports = python;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/python-repl.js
var require_python_repl = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/python-repl.js"(exports, module) {
    function pythonRepl(hljs) {
      return {
        aliases: ["pycon"],
        contains: [
          {
            className: "meta",
            starts: {
              // a space separates the REPL prefix from the actual code
              // this is purely for cleaner HTML output
              end: / |$/,
              starts: {
                end: "$",
                subLanguage: "python"
              }
            },
            variants: [
              {
                begin: /^>>>(?=[ ]|$)/
              },
              {
                begin: /^\.\.\.(?=[ ]|$)/
              }
            ]
          }
        ]
      };
    }
    module.exports = pythonRepl;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/r.js
var require_r = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/r.js"(exports, module) {
    function r(hljs) {
      const regex = hljs.regex;
      const IDENT_RE = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/;
      const NUMBER_TYPES_RE = regex.either(
        // Special case: only hexadecimal binary powers can contain fractions
        /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,
        // Hexadecimal numbers without fraction and optional binary power
        /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,
        // Decimal numbers
        /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/
      );
      const OPERATORS_RE = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/;
      const PUNCTUATION_RE = regex.either(
        /[()]/,
        /[{}]/,
        /\[\[/,
        /[[\]]/,
        /\\/,
        /,/
      );
      return {
        name: "R",
        keywords: {
          $pattern: IDENT_RE,
          keyword: "function if in break next repeat else for while",
          literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
          built_in: (
            // Builtin constants
            "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
          )
        },
        contains: [
          // Roxygen comments
          hljs.COMMENT(
            /#'/,
            /$/,
            {
              contains: [
                {
                  // Handle `@examples` separately to cause all subsequent code
                  // until the next `@`-tag on its own line to be kept as-is,
                  // preventing highlighting. This code is example R code, so nested
                  // doctags shouldn’t be treated as such. See
                  // `test/markup/r/roxygen.txt` for an example.
                  scope: "doctag",
                  match: /@examples/,
                  starts: {
                    end: regex.lookahead(regex.either(
                      // end if another doc comment
                      /\n^#'\s*(?=@[a-zA-Z]+)/,
                      // or a line with no comment
                      /\n^(?!#')/
                    )),
                    endsParent: true
                  }
                },
                {
                  // Handle `@param` to highlight the parameter name following
                  // after.
                  scope: "doctag",
                  begin: "@param",
                  end: /$/,
                  contains: [
                    {
                      scope: "variable",
                      variants: [
                        { match: IDENT_RE },
                        { match: /`(?:\\.|[^`\\])+`/ }
                      ],
                      endsParent: true
                    }
                  ]
                },
                {
                  scope: "doctag",
                  match: /@[a-zA-Z]+/
                },
                {
                  scope: "keyword",
                  match: /\\[a-zA-Z]+/
                }
              ]
            }
          ),
          hljs.HASH_COMMENT_MODE,
          {
            scope: "string",
            contains: [hljs.BACKSLASH_ESCAPE],
            variants: [
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\(/, end: /\)(-*)"/ }),
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\{/, end: /\}(-*)"/ }),
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\[/, end: /\](-*)"/ }),
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\(/, end: /\)(-*)'/ }),
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\{/, end: /\}(-*)'/ }),
              hljs.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\[/, end: /\](-*)'/ }),
              { begin: '"', end: '"', relevance: 0 },
              { begin: "'", end: "'", relevance: 0 }
            ]
          },
          // Matching numbers immediately following punctuation and operators is
          // tricky since we need to look at the character ahead of a number to
          // ensure the number is not part of an identifier, and we cannot use
          // negative look-behind assertions. So instead we explicitly handle all
          // possible combinations of (operator|punctuation), number.
          // TODO: replace with negative look-behind when available
          // { begin: /(?<![a-zA-Z0-9._])0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/ },
          // { begin: /(?<![a-zA-Z0-9._])0[xX][0-9a-fA-F]+([pP][+-]?\d+)?[Li]?/ },
          // { begin: /(?<![a-zA-Z0-9._])(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[Li]?/ }
          {
            relevance: 0,
            variants: [
              {
                scope: {
                  1: "operator",
                  2: "number"
                },
                match: [
                  OPERATORS_RE,
                  NUMBER_TYPES_RE
                ]
              },
              {
                scope: {
                  1: "operator",
                  2: "number"
                },
                match: [
                  /%[^%]*%/,
                  NUMBER_TYPES_RE
                ]
              },
              {
                scope: {
                  1: "punctuation",
                  2: "number"
                },
                match: [
                  PUNCTUATION_RE,
                  NUMBER_TYPES_RE
                ]
              },
              {
                scope: { 2: "number" },
                match: [
                  /[^a-zA-Z0-9._]|^/,
                  // not part of an identifier, or start of document
                  NUMBER_TYPES_RE
                ]
              }
            ]
          },
          // Operators/punctuation when they're not directly followed by numbers
          {
            // Relevance boost for the most common assignment form.
            scope: { 3: "operator" },
            match: [
              IDENT_RE,
              /\s+/,
              /<-/,
              /\s+/
            ]
          },
          {
            scope: "operator",
            relevance: 0,
            variants: [
              { match: OPERATORS_RE },
              { match: /%[^%]*%/ }
            ]
          },
          {
            scope: "punctuation",
            relevance: 0,
            match: PUNCTUATION_RE
          },
          {
            // Escaped identifier
            begin: "`",
            end: "`",
            contains: [
              { begin: /\\./ }
            ]
          }
        ]
      };
    }
    module.exports = r;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/rust.js
var require_rust = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/rust.js"(exports, module) {
    function rust(hljs) {
      const regex = hljs.regex;
      const FUNCTION_INVOKE = {
        className: "title.function.invoke",
        relevance: 0,
        begin: regex.concat(
          /\b/,
          /(?!let\b)/,
          hljs.IDENT_RE,
          regex.lookahead(/\s*\(/)
        )
      };
      const NUMBER_SUFFIX = "([ui](8|16|32|64|128|size)|f(32|64))?";
      const KEYWORDS = [
        "abstract",
        "as",
        "async",
        "await",
        "become",
        "box",
        "break",
        "const",
        "continue",
        "crate",
        "do",
        "dyn",
        "else",
        "enum",
        "extern",
        "false",
        "final",
        "fn",
        "for",
        "if",
        "impl",
        "in",
        "let",
        "loop",
        "macro",
        "match",
        "mod",
        "move",
        "mut",
        "override",
        "priv",
        "pub",
        "ref",
        "return",
        "self",
        "Self",
        "static",
        "struct",
        "super",
        "trait",
        "true",
        "try",
        "type",
        "typeof",
        "unsafe",
        "unsized",
        "use",
        "virtual",
        "where",
        "while",
        "yield"
      ];
      const LITERALS = [
        "true",
        "false",
        "Some",
        "None",
        "Ok",
        "Err"
      ];
      const BUILTINS = [
        // functions
        "drop ",
        // traits
        "Copy",
        "Send",
        "Sized",
        "Sync",
        "Drop",
        "Fn",
        "FnMut",
        "FnOnce",
        "ToOwned",
        "Clone",
        "Debug",
        "PartialEq",
        "PartialOrd",
        "Eq",
        "Ord",
        "AsRef",
        "AsMut",
        "Into",
        "From",
        "Default",
        "Iterator",
        "Extend",
        "IntoIterator",
        "DoubleEndedIterator",
        "ExactSizeIterator",
        "SliceConcatExt",
        "ToString",
        // macros
        "assert!",
        "assert_eq!",
        "bitflags!",
        "bytes!",
        "cfg!",
        "col!",
        "concat!",
        "concat_idents!",
        "debug_assert!",
        "debug_assert_eq!",
        "env!",
        "panic!",
        "file!",
        "format!",
        "format_args!",
        "include_bin!",
        "include_str!",
        "line!",
        "local_data_key!",
        "module_path!",
        "option_env!",
        "print!",
        "println!",
        "select!",
        "stringify!",
        "try!",
        "unimplemented!",
        "unreachable!",
        "vec!",
        "write!",
        "writeln!",
        "macro_rules!",
        "assert_ne!",
        "debug_assert_ne!"
      ];
      const TYPES = [
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "isize",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "usize",
        "f32",
        "f64",
        "str",
        "char",
        "bool",
        "Box",
        "Option",
        "Result",
        "String",
        "Vec"
      ];
      return {
        name: "Rust",
        aliases: ["rs"],
        keywords: {
          $pattern: hljs.IDENT_RE + "!?",
          type: TYPES,
          keyword: KEYWORDS,
          literal: LITERALS,
          built_in: BUILTINS
        },
        illegal: "</",
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.COMMENT("/\\*", "\\*/", {
            contains: ["self"]
          }),
          hljs.inherit(hljs.QUOTE_STRING_MODE, {
            begin: /b?"/,
            illegal: null
          }),
          {
            className: "string",
            variants: [
              {
                begin: /b?r(#*)"(.|\n)*?"\1(?!#)/
              },
              {
                begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
              }
            ]
          },
          {
            className: "symbol",
            begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
          },
          {
            className: "number",
            variants: [
              {
                begin: "\\b0b([01_]+)" + NUMBER_SUFFIX
              },
              {
                begin: "\\b0o([0-7_]+)" + NUMBER_SUFFIX
              },
              {
                begin: "\\b0x([A-Fa-f0-9_]+)" + NUMBER_SUFFIX
              },
              {
                begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + NUMBER_SUFFIX
              }
            ],
            relevance: 0
          },
          {
            begin: [
              /fn/,
              /\s+/,
              hljs.UNDERSCORE_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "title.function"
            }
          },
          {
            className: "meta",
            begin: "#!?\\[",
            end: "\\]",
            contains: [
              {
                className: "string",
                begin: /"/,
                end: /"/
              }
            ]
          },
          {
            begin: [
              /let/,
              /\s+/,
              /(?:mut\s+)?/,
              hljs.UNDERSCORE_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "keyword",
              4: "variable"
            }
          },
          // must come before impl/for rule later
          {
            begin: [
              /for/,
              /\s+/,
              hljs.UNDERSCORE_IDENT_RE,
              /\s+/,
              /in/
            ],
            className: {
              1: "keyword",
              3: "variable",
              5: "keyword"
            }
          },
          {
            begin: [
              /type/,
              /\s+/,
              hljs.UNDERSCORE_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "title.class"
            }
          },
          {
            begin: [
              /(?:trait|enum|struct|union|impl|for)/,
              /\s+/,
              hljs.UNDERSCORE_IDENT_RE
            ],
            className: {
              1: "keyword",
              3: "title.class"
            }
          },
          {
            begin: hljs.IDENT_RE + "::",
            keywords: {
              keyword: "Self",
              built_in: BUILTINS
            }
          },
          {
            className: "punctuation",
            begin: "->"
          },
          FUNCTION_INVOKE
        ]
      };
    }
    module.exports = rust;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/scss.js
var require_scss = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/scss.js"(exports, module) {
    var MODES = (hljs) => {
      return {
        IMPORTANT: {
          scope: "meta",
          begin: "!important"
        },
        BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
        },
        FUNCTION_DISPATCH: {
          className: "built_in",
          begin: /[\w-]+(?=\()/
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z][A-Za-z0-9_-]*/
        }
      };
    };
    var TAGS = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "p",
      "q",
      "quote",
      "samp",
      "section",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video"
    ];
    var MEDIA_FEATURES = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      // TODO: find a better solution?
      "min-width",
      "max-width",
      "min-height",
      "max-height"
    ];
    var PSEUDO_CLASSES = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      // dir()
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      // has()
      "host",
      // host or host()
      "host-context",
      // host-context()
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      // is()
      "lang",
      // lang()
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      // not()
      "nth-child",
      // nth-child()
      "nth-col",
      // nth-col()
      "nth-last-child",
      // nth-last-child()
      "nth-last-col",
      // nth-last-col()
      "nth-last-of-type",
      //nth-last-of-type()
      "nth-of-type",
      //nth-of-type()
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where"
      // where()
    ];
    var PSEUDO_ELEMENTS = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error"
    ];
    var ATTRIBUTES = [
      "align-content",
      "align-items",
      "align-self",
      "all",
      "animation",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-timing-function",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-repeat",
      "background-size",
      "border",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-decoration-break",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "direction",
      "display",
      "empty-cells",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-size",
      "font-size-adjust",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-variant",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "gap",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "isolation",
      "justify-content",
      "left",
      "letter-spacing",
      "line-break",
      "line-height",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "max-height",
      "max-width",
      "min-height",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "padding",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "pointer-events",
      "position",
      "quotes",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "row-gap",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "speak",
      "speak-as",
      "src",
      // @font-face
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-style",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-transform",
      "text-underline-position",
      "top",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "unicode-bidi",
      "vertical-align",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "z-index"
      // reverse makes sure longer attributes `font-weight` are matched fully
      // instead of getting false positives on say `font`
    ].reverse();
    function scss(hljs) {
      const modes = MODES(hljs);
      const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS;
      const PSEUDO_CLASSES$1 = PSEUDO_CLASSES;
      const AT_IDENTIFIER = "@[a-z-]+";
      const AT_MODIFIERS = "and or not only";
      const IDENT_RE = "[a-zA-Z-][a-zA-Z0-9_-]*";
      const VARIABLE = {
        className: "variable",
        begin: "(\\$" + IDENT_RE + ")\\b"
      };
      return {
        name: "SCSS",
        case_insensitive: true,
        illegal: "[=/|']",
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          // to recognize keyframe 40% etc which are outside the scope of our
          // attribute value mode
          modes.CSS_NUMBER_MODE,
          {
            className: "selector-id",
            begin: "#[A-Za-z0-9_-]+",
            relevance: 0
          },
          {
            className: "selector-class",
            begin: "\\.[A-Za-z0-9_-]+",
            relevance: 0
          },
          modes.ATTRIBUTE_SELECTOR_MODE,
          {
            className: "selector-tag",
            begin: "\\b(" + TAGS.join("|") + ")\\b",
            // was there, before, but why?
            relevance: 0
          },
          {
            className: "selector-pseudo",
            begin: ":(" + PSEUDO_CLASSES$1.join("|") + ")"
          },
          {
            className: "selector-pseudo",
            begin: ":(:)?(" + PSEUDO_ELEMENTS$1.join("|") + ")"
          },
          VARIABLE,
          {
            // pseudo-selector params
            begin: /\(/,
            end: /\)/,
            contains: [modes.CSS_NUMBER_MODE]
          },
          modes.CSS_VARIABLE,
          {
            className: "attribute",
            begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
          },
          {
            begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
          },
          {
            begin: /:/,
            end: /[;}{]/,
            contains: [
              modes.BLOCK_COMMENT,
              VARIABLE,
              modes.HEXCOLOR,
              modes.CSS_NUMBER_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.APOS_STRING_MODE,
              modes.IMPORTANT
            ]
          },
          // matching these here allows us to treat them more like regular CSS
          // rules so everything between the {} gets regular rule highlighting,
          // which is what we want for page and font-face
          {
            begin: "@(page|font-face)",
            keywords: {
              $pattern: AT_IDENTIFIER,
              keyword: "@page @font-face"
            }
          },
          {
            begin: "@",
            end: "[{;]",
            returnBegin: true,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: AT_MODIFIERS,
              attribute: MEDIA_FEATURES.join(" ")
            },
            contains: [
              {
                begin: AT_IDENTIFIER,
                className: "keyword"
              },
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              VARIABLE,
              hljs.QUOTE_STRING_MODE,
              hljs.APOS_STRING_MODE,
              modes.HEXCOLOR,
              modes.CSS_NUMBER_MODE
            ]
          },
          modes.FUNCTION_DISPATCH
        ]
      };
    }
    module.exports = scss;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/shell.js
var require_shell = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/shell.js"(exports, module) {
    function shell(hljs) {
      return {
        name: "Shell Session",
        aliases: ["console", "shellsession"],
        contains: [
          {
            className: "meta",
            // We cannot add \s (spaces) in the regular expression otherwise it will be too broad and produce unexpected result.
            // For instance, in the following example, it would match "echo /path/to/home >" as a prompt:
            // echo /path/to/home > t.exe
            begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
            starts: {
              end: /[^\\](?=\s*$)/,
              subLanguage: "bash"
            }
          }
        ]
      };
    }
    module.exports = shell;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/sql.js
var require_sql = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/sql.js"(exports, module) {
    function sql(hljs) {
      const regex = hljs.regex;
      const COMMENT_MODE = hljs.COMMENT("--", "$");
      const STRING = {
        className: "string",
        variants: [
          {
            begin: /'/,
            end: /'/,
            contains: [
              { begin: /''/ }
            ]
          }
        ]
      };
      const QUOTED_IDENTIFIER = {
        begin: /"/,
        end: /"/,
        contains: [{ begin: /""/ }]
      };
      const LITERALS = [
        "true",
        "false",
        // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
        // "null",
        "unknown"
      ];
      const MULTI_WORD_TYPES = [
        "double precision",
        "large object",
        "with timezone",
        "without timezone"
      ];
      const TYPES = [
        "bigint",
        "binary",
        "blob",
        "boolean",
        "char",
        "character",
        "clob",
        "date",
        "dec",
        "decfloat",
        "decimal",
        "float",
        "int",
        "integer",
        "interval",
        "nchar",
        "nclob",
        "national",
        "numeric",
        "real",
        "row",
        "smallint",
        "time",
        "timestamp",
        "varchar",
        "varying",
        // modifier (character varying)
        "varbinary"
      ];
      const NON_RESERVED_WORDS = [
        "add",
        "asc",
        "collation",
        "desc",
        "final",
        "first",
        "last",
        "view"
      ];
      const RESERVED_WORDS = [
        "abs",
        "acos",
        "all",
        "allocate",
        "alter",
        "and",
        "any",
        "are",
        "array",
        "array_agg",
        "array_max_cardinality",
        "as",
        "asensitive",
        "asin",
        "asymmetric",
        "at",
        "atan",
        "atomic",
        "authorization",
        "avg",
        "begin",
        "begin_frame",
        "begin_partition",
        "between",
        "bigint",
        "binary",
        "blob",
        "boolean",
        "both",
        "by",
        "call",
        "called",
        "cardinality",
        "cascaded",
        "case",
        "cast",
        "ceil",
        "ceiling",
        "char",
        "char_length",
        "character",
        "character_length",
        "check",
        "classifier",
        "clob",
        "close",
        "coalesce",
        "collate",
        "collect",
        "column",
        "commit",
        "condition",
        "connect",
        "constraint",
        "contains",
        "convert",
        "copy",
        "corr",
        "corresponding",
        "cos",
        "cosh",
        "count",
        "covar_pop",
        "covar_samp",
        "create",
        "cross",
        "cube",
        "cume_dist",
        "current",
        "current_catalog",
        "current_date",
        "current_default_transform_group",
        "current_path",
        "current_role",
        "current_row",
        "current_schema",
        "current_time",
        "current_timestamp",
        "current_path",
        "current_role",
        "current_transform_group_for_type",
        "current_user",
        "cursor",
        "cycle",
        "date",
        "day",
        "deallocate",
        "dec",
        "decimal",
        "decfloat",
        "declare",
        "default",
        "define",
        "delete",
        "dense_rank",
        "deref",
        "describe",
        "deterministic",
        "disconnect",
        "distinct",
        "double",
        "drop",
        "dynamic",
        "each",
        "element",
        "else",
        "empty",
        "end",
        "end_frame",
        "end_partition",
        "end-exec",
        "equals",
        "escape",
        "every",
        "except",
        "exec",
        "execute",
        "exists",
        "exp",
        "external",
        "extract",
        "false",
        "fetch",
        "filter",
        "first_value",
        "float",
        "floor",
        "for",
        "foreign",
        "frame_row",
        "free",
        "from",
        "full",
        "function",
        "fusion",
        "get",
        "global",
        "grant",
        "group",
        "grouping",
        "groups",
        "having",
        "hold",
        "hour",
        "identity",
        "in",
        "indicator",
        "initial",
        "inner",
        "inout",
        "insensitive",
        "insert",
        "int",
        "integer",
        "intersect",
        "intersection",
        "interval",
        "into",
        "is",
        "join",
        "json_array",
        "json_arrayagg",
        "json_exists",
        "json_object",
        "json_objectagg",
        "json_query",
        "json_table",
        "json_table_primitive",
        "json_value",
        "lag",
        "language",
        "large",
        "last_value",
        "lateral",
        "lead",
        "leading",
        "left",
        "like",
        "like_regex",
        "listagg",
        "ln",
        "local",
        "localtime",
        "localtimestamp",
        "log",
        "log10",
        "lower",
        "match",
        "match_number",
        "match_recognize",
        "matches",
        "max",
        "member",
        "merge",
        "method",
        "min",
        "minute",
        "mod",
        "modifies",
        "module",
        "month",
        "multiset",
        "national",
        "natural",
        "nchar",
        "nclob",
        "new",
        "no",
        "none",
        "normalize",
        "not",
        "nth_value",
        "ntile",
        "null",
        "nullif",
        "numeric",
        "octet_length",
        "occurrences_regex",
        "of",
        "offset",
        "old",
        "omit",
        "on",
        "one",
        "only",
        "open",
        "or",
        "order",
        "out",
        "outer",
        "over",
        "overlaps",
        "overlay",
        "parameter",
        "partition",
        "pattern",
        "per",
        "percent",
        "percent_rank",
        "percentile_cont",
        "percentile_disc",
        "period",
        "portion",
        "position",
        "position_regex",
        "power",
        "precedes",
        "precision",
        "prepare",
        "primary",
        "procedure",
        "ptf",
        "range",
        "rank",
        "reads",
        "real",
        "recursive",
        "ref",
        "references",
        "referencing",
        "regr_avgx",
        "regr_avgy",
        "regr_count",
        "regr_intercept",
        "regr_r2",
        "regr_slope",
        "regr_sxx",
        "regr_sxy",
        "regr_syy",
        "release",
        "result",
        "return",
        "returns",
        "revoke",
        "right",
        "rollback",
        "rollup",
        "row",
        "row_number",
        "rows",
        "running",
        "savepoint",
        "scope",
        "scroll",
        "search",
        "second",
        "seek",
        "select",
        "sensitive",
        "session_user",
        "set",
        "show",
        "similar",
        "sin",
        "sinh",
        "skip",
        "smallint",
        "some",
        "specific",
        "specifictype",
        "sql",
        "sqlexception",
        "sqlstate",
        "sqlwarning",
        "sqrt",
        "start",
        "static",
        "stddev_pop",
        "stddev_samp",
        "submultiset",
        "subset",
        "substring",
        "substring_regex",
        "succeeds",
        "sum",
        "symmetric",
        "system",
        "system_time",
        "system_user",
        "table",
        "tablesample",
        "tan",
        "tanh",
        "then",
        "time",
        "timestamp",
        "timezone_hour",
        "timezone_minute",
        "to",
        "trailing",
        "translate",
        "translate_regex",
        "translation",
        "treat",
        "trigger",
        "trim",
        "trim_array",
        "true",
        "truncate",
        "uescape",
        "union",
        "unique",
        "unknown",
        "unnest",
        "update",
        "upper",
        "user",
        "using",
        "value",
        "values",
        "value_of",
        "var_pop",
        "var_samp",
        "varbinary",
        "varchar",
        "varying",
        "versioning",
        "when",
        "whenever",
        "where",
        "width_bucket",
        "window",
        "with",
        "within",
        "without",
        "year"
      ];
      const RESERVED_FUNCTIONS = [
        "abs",
        "acos",
        "array_agg",
        "asin",
        "atan",
        "avg",
        "cast",
        "ceil",
        "ceiling",
        "coalesce",
        "corr",
        "cos",
        "cosh",
        "count",
        "covar_pop",
        "covar_samp",
        "cume_dist",
        "dense_rank",
        "deref",
        "element",
        "exp",
        "extract",
        "first_value",
        "floor",
        "json_array",
        "json_arrayagg",
        "json_exists",
        "json_object",
        "json_objectagg",
        "json_query",
        "json_table",
        "json_table_primitive",
        "json_value",
        "lag",
        "last_value",
        "lead",
        "listagg",
        "ln",
        "log",
        "log10",
        "lower",
        "max",
        "min",
        "mod",
        "nth_value",
        "ntile",
        "nullif",
        "percent_rank",
        "percentile_cont",
        "percentile_disc",
        "position",
        "position_regex",
        "power",
        "rank",
        "regr_avgx",
        "regr_avgy",
        "regr_count",
        "regr_intercept",
        "regr_r2",
        "regr_slope",
        "regr_sxx",
        "regr_sxy",
        "regr_syy",
        "row_number",
        "sin",
        "sinh",
        "sqrt",
        "stddev_pop",
        "stddev_samp",
        "substring",
        "substring_regex",
        "sum",
        "tan",
        "tanh",
        "translate",
        "translate_regex",
        "treat",
        "trim",
        "trim_array",
        "unnest",
        "upper",
        "value_of",
        "var_pop",
        "var_samp",
        "width_bucket"
      ];
      const POSSIBLE_WITHOUT_PARENS = [
        "current_catalog",
        "current_date",
        "current_default_transform_group",
        "current_path",
        "current_role",
        "current_schema",
        "current_transform_group_for_type",
        "current_user",
        "session_user",
        "system_time",
        "system_user",
        "current_time",
        "localtime",
        "current_timestamp",
        "localtimestamp"
      ];
      const COMBOS = [
        "create table",
        "insert into",
        "primary key",
        "foreign key",
        "not null",
        "alter table",
        "add constraint",
        "grouping sets",
        "on overflow",
        "character set",
        "respect nulls",
        "ignore nulls",
        "nulls first",
        "nulls last",
        "depth first",
        "breadth first"
      ];
      const FUNCTIONS = RESERVED_FUNCTIONS;
      const KEYWORDS = [...RESERVED_WORDS, ...NON_RESERVED_WORDS].filter((keyword) => {
        return !RESERVED_FUNCTIONS.includes(keyword);
      });
      const VARIABLE = {
        className: "variable",
        begin: /@[a-z0-9]+/
      };
      const OPERATOR = {
        className: "operator",
        begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
        relevance: 0
      };
      const FUNCTION_CALL = {
        begin: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
        relevance: 0,
        keywords: {
          built_in: FUNCTIONS
        }
      };
      function reduceRelevancy(list, { exceptions, when } = {}) {
        const qualifyFn = when;
        exceptions = exceptions || [];
        return list.map((item) => {
          if (item.match(/\|\d+$/) || exceptions.includes(item)) {
            return item;
          } else if (qualifyFn(item)) {
            return `${item}|0`;
          } else {
            return item;
          }
        });
      }
      return {
        name: "SQL",
        case_insensitive: true,
        // does not include {} or HTML tags `</`
        illegal: /[{}]|<\//,
        keywords: {
          $pattern: /\b[\w\.]+/,
          keyword: reduceRelevancy(KEYWORDS, { when: (x) => x.length < 3 }),
          literal: LITERALS,
          type: TYPES,
          built_in: POSSIBLE_WITHOUT_PARENS
        },
        contains: [
          {
            begin: regex.either(...COMBOS),
            relevance: 0,
            keywords: {
              $pattern: /[\w\.]+/,
              keyword: KEYWORDS.concat(COMBOS),
              literal: LITERALS,
              type: TYPES
            }
          },
          {
            className: "type",
            begin: regex.either(...MULTI_WORD_TYPES)
          },
          FUNCTION_CALL,
          VARIABLE,
          STRING,
          QUOTED_IDENTIFIER,
          hljs.C_NUMBER_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          COMMENT_MODE,
          OPERATOR
        ]
      };
    }
    module.exports = sql;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/swift.js
var require_swift = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/swift.js"(exports, module) {
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];
      if (typeof opts === "object" && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    var keywordWrapper = (keyword) => concat(
      /\b/,
      keyword,
      /\w$/.test(keyword) ? /\b/ : /\B/
    );
    var dotKeywords = [
      "Protocol",
      // contextual
      "Type"
      // contextual
    ].map(keywordWrapper);
    var optionalDotKeywords = [
      "init",
      "self"
    ].map(keywordWrapper);
    var keywordTypes = [
      "Any",
      "Self"
    ];
    var keywords = [
      // strings below will be fed into the regular `keywords` engine while regex
      // will result in additional modes being created to scan for those keywords to
      // avoid conflicts with other rules
      "actor",
      "associatedtype",
      "async",
      "await",
      /as\?/,
      // operator
      /as!/,
      // operator
      "as",
      // operator
      "break",
      "case",
      "catch",
      "class",
      "continue",
      "convenience",
      // contextual
      "default",
      "defer",
      "deinit",
      "didSet",
      // contextual
      "do",
      "dynamic",
      // contextual
      "else",
      "enum",
      "extension",
      "fallthrough",
      /fileprivate\(set\)/,
      "fileprivate",
      "final",
      // contextual
      "for",
      "func",
      "get",
      // contextual
      "guard",
      "if",
      "import",
      "indirect",
      // contextual
      "infix",
      // contextual
      /init\?/,
      /init!/,
      "inout",
      /internal\(set\)/,
      "internal",
      "in",
      "is",
      // operator
      "isolated",
      // contextual
      "nonisolated",
      // contextual
      "lazy",
      // contextual
      "let",
      "mutating",
      // contextual
      "nonmutating",
      // contextual
      /open\(set\)/,
      // contextual
      "open",
      // contextual
      "operator",
      "optional",
      // contextual
      "override",
      // contextual
      "postfix",
      // contextual
      "precedencegroup",
      "prefix",
      // contextual
      /private\(set\)/,
      "private",
      "protocol",
      /public\(set\)/,
      "public",
      "repeat",
      "required",
      // contextual
      "rethrows",
      "return",
      "set",
      // contextual
      "some",
      // contextual
      "static",
      "struct",
      "subscript",
      "super",
      "switch",
      "throws",
      "throw",
      /try\?/,
      // operator
      /try!/,
      // operator
      "try",
      // operator
      "typealias",
      /unowned\(safe\)/,
      // contextual
      /unowned\(unsafe\)/,
      // contextual
      "unowned",
      // contextual
      "var",
      "weak",
      // contextual
      "where",
      "while",
      "willSet"
      // contextual
    ];
    var literals = [
      "false",
      "nil",
      "true"
    ];
    var precedencegroupKeywords = [
      "assignment",
      "associativity",
      "higherThan",
      "left",
      "lowerThan",
      "none",
      "right"
    ];
    var numberSignKeywords = [
      "#colorLiteral",
      "#column",
      "#dsohandle",
      "#else",
      "#elseif",
      "#endif",
      "#error",
      "#file",
      "#fileID",
      "#fileLiteral",
      "#filePath",
      "#function",
      "#if",
      "#imageLiteral",
      "#keyPath",
      "#line",
      "#selector",
      "#sourceLocation",
      "#warn_unqualified_access",
      "#warning"
    ];
    var builtIns = [
      "abs",
      "all",
      "any",
      "assert",
      "assertionFailure",
      "debugPrint",
      "dump",
      "fatalError",
      "getVaList",
      "isKnownUniquelyReferenced",
      "max",
      "min",
      "numericCast",
      "pointwiseMax",
      "pointwiseMin",
      "precondition",
      "preconditionFailure",
      "print",
      "readLine",
      "repeatElement",
      "sequence",
      "stride",
      "swap",
      "swift_unboxFromSwiftValueWithType",
      "transcode",
      "type",
      "unsafeBitCast",
      "unsafeDowncast",
      "withExtendedLifetime",
      "withUnsafeMutablePointer",
      "withUnsafePointer",
      "withVaList",
      "withoutActuallyEscaping",
      "zip"
    ];
    var operatorHead = either(
      /[/=\-+!*%<>&|^~?]/,
      /[\u00A1-\u00A7]/,
      /[\u00A9\u00AB]/,
      /[\u00AC\u00AE]/,
      /[\u00B0\u00B1]/,
      /[\u00B6\u00BB\u00BF\u00D7\u00F7]/,
      /[\u2016-\u2017]/,
      /[\u2020-\u2027]/,
      /[\u2030-\u203E]/,
      /[\u2041-\u2053]/,
      /[\u2055-\u205E]/,
      /[\u2190-\u23FF]/,
      /[\u2500-\u2775]/,
      /[\u2794-\u2BFF]/,
      /[\u2E00-\u2E7F]/,
      /[\u3001-\u3003]/,
      /[\u3008-\u3020]/,
      /[\u3030]/
    );
    var operatorCharacter = either(
      operatorHead,
      /[\u0300-\u036F]/,
      /[\u1DC0-\u1DFF]/,
      /[\u20D0-\u20FF]/,
      /[\uFE00-\uFE0F]/,
      /[\uFE20-\uFE2F]/
      // TODO: The following characters are also allowed, but the regex isn't supported yet.
      // /[\u{E0100}-\u{E01EF}]/u
    );
    var operator = concat(operatorHead, operatorCharacter, "*");
    var identifierHead = either(
      /[a-zA-Z_]/,
      /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,
      /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,
      /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,
      /[\u1E00-\u1FFF]/,
      /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,
      /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,
      /[\u2C00-\u2DFF\u2E80-\u2FFF]/,
      /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,
      /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,
      /[\uFE47-\uFEFE\uFF00-\uFFFD]/
      // Should be /[\uFE47-\uFFFD]/, but we have to exclude FEFF.
      // The following characters are also allowed, but the regexes aren't supported yet.
      // /[\u{10000}-\u{1FFFD}\u{20000-\u{2FFFD}\u{30000}-\u{3FFFD}\u{40000}-\u{4FFFD}]/u,
      // /[\u{50000}-\u{5FFFD}\u{60000-\u{6FFFD}\u{70000}-\u{7FFFD}\u{80000}-\u{8FFFD}]/u,
      // /[\u{90000}-\u{9FFFD}\u{A0000-\u{AFFFD}\u{B0000}-\u{BFFFD}\u{C0000}-\u{CFFFD}]/u,
      // /[\u{D0000}-\u{DFFFD}\u{E0000-\u{EFFFD}]/u
    );
    var identifierCharacter = either(
      identifierHead,
      /\d/,
      /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/
    );
    var identifier = concat(identifierHead, identifierCharacter, "*");
    var typeIdentifier = concat(/[A-Z]/, identifierCharacter, "*");
    var keywordAttributes = [
      "autoclosure",
      concat(/convention\(/, either("swift", "block", "c"), /\)/),
      "discardableResult",
      "dynamicCallable",
      "dynamicMemberLookup",
      "escaping",
      "frozen",
      "GKInspectable",
      "IBAction",
      "IBDesignable",
      "IBInspectable",
      "IBOutlet",
      "IBSegueAction",
      "inlinable",
      "main",
      "nonobjc",
      "NSApplicationMain",
      "NSCopying",
      "NSManaged",
      concat(/objc\(/, identifier, /\)/),
      "objc",
      "objcMembers",
      "propertyWrapper",
      "requires_stored_property_inits",
      "resultBuilder",
      "testable",
      "UIApplicationMain",
      "unknown",
      "usableFromInline"
    ];
    var availabilityKeywords = [
      "iOS",
      "iOSApplicationExtension",
      "macOS",
      "macOSApplicationExtension",
      "macCatalyst",
      "macCatalystApplicationExtension",
      "watchOS",
      "watchOSApplicationExtension",
      "tvOS",
      "tvOSApplicationExtension",
      "swift"
    ];
    function swift(hljs) {
      const WHITESPACE = {
        match: /\s+/,
        relevance: 0
      };
      const BLOCK_COMMENT = hljs.COMMENT(
        "/\\*",
        "\\*/",
        {
          contains: ["self"]
        }
      );
      const COMMENTS = [
        hljs.C_LINE_COMMENT_MODE,
        BLOCK_COMMENT
      ];
      const DOT_KEYWORD = {
        match: [
          /\./,
          either(...dotKeywords, ...optionalDotKeywords)
        ],
        className: {
          2: "keyword"
        }
      };
      const KEYWORD_GUARD = {
        // Consume .keyword to prevent highlighting properties and methods as keywords.
        match: concat(/\./, either(...keywords)),
        relevance: 0
      };
      const PLAIN_KEYWORDS = keywords.filter((kw) => typeof kw === "string").concat(["_|0"]);
      const REGEX_KEYWORDS = keywords.filter((kw) => typeof kw !== "string").concat(keywordTypes).map(keywordWrapper);
      const KEYWORD = {
        variants: [
          {
            className: "keyword",
            match: either(...REGEX_KEYWORDS, ...optionalDotKeywords)
          }
        ]
      };
      const KEYWORDS = {
        $pattern: either(
          /\b\w+/,
          // regular keywords
          /#\w+/
          // number keywords
        ),
        keyword: PLAIN_KEYWORDS.concat(numberSignKeywords),
        literal: literals
      };
      const KEYWORD_MODES = [
        DOT_KEYWORD,
        KEYWORD_GUARD,
        KEYWORD
      ];
      const BUILT_IN_GUARD = {
        // Consume .built_in to prevent highlighting properties and methods.
        match: concat(/\./, either(...builtIns)),
        relevance: 0
      };
      const BUILT_IN = {
        className: "built_in",
        match: concat(/\b/, either(...builtIns), /(?=\()/)
      };
      const BUILT_INS = [
        BUILT_IN_GUARD,
        BUILT_IN
      ];
      const OPERATOR_GUARD = {
        // Prevent -> from being highlighting as an operator.
        match: /->/,
        relevance: 0
      };
      const OPERATOR = {
        className: "operator",
        relevance: 0,
        variants: [
          {
            match: operator
          },
          {
            // dot-operator: only operators that start with a dot are allowed to use dots as
            // characters (..., ...<, .*, etc). So there rule here is: a dot followed by one or more
            // characters that may also include dots.
            match: `\\.(\\.|${operatorCharacter})+`
          }
        ]
      };
      const OPERATORS = [
        OPERATOR_GUARD,
        OPERATOR
      ];
      const decimalDigits = "([0-9]_*)+";
      const hexDigits = "([0-9a-fA-F]_*)+";
      const NUMBER = {
        className: "number",
        relevance: 0,
        variants: [
          // decimal floating-point-literal (subsumes decimal-literal)
          {
            match: `\\b(${decimalDigits})(\\.(${decimalDigits}))?([eE][+-]?(${decimalDigits}))?\\b`
          },
          // hexadecimal floating-point-literal (subsumes hexadecimal-literal)
          {
            match: `\\b0x(${hexDigits})(\\.(${hexDigits}))?([pP][+-]?(${decimalDigits}))?\\b`
          },
          // octal-literal
          {
            match: /\b0o([0-7]_*)+\b/
          },
          // binary-literal
          {
            match: /\b0b([01]_*)+\b/
          }
        ]
      };
      const ESCAPED_CHARACTER = (rawDelimiter = "") => ({
        className: "subst",
        variants: [
          {
            match: concat(/\\/, rawDelimiter, /[0\\tnr"']/)
          },
          {
            match: concat(/\\/, rawDelimiter, /u\{[0-9a-fA-F]{1,8}\}/)
          }
        ]
      });
      const ESCAPED_NEWLINE = (rawDelimiter = "") => ({
        className: "subst",
        match: concat(/\\/, rawDelimiter, /[\t ]*(?:[\r\n]|\r\n)/)
      });
      const INTERPOLATION = (rawDelimiter = "") => ({
        className: "subst",
        label: "interpol",
        begin: concat(/\\/, rawDelimiter, /\(/),
        end: /\)/
      });
      const MULTILINE_STRING = (rawDelimiter = "") => ({
        begin: concat(rawDelimiter, /"""/),
        end: concat(/"""/, rawDelimiter),
        contains: [
          ESCAPED_CHARACTER(rawDelimiter),
          ESCAPED_NEWLINE(rawDelimiter),
          INTERPOLATION(rawDelimiter)
        ]
      });
      const SINGLE_LINE_STRING = (rawDelimiter = "") => ({
        begin: concat(rawDelimiter, /"/),
        end: concat(/"/, rawDelimiter),
        contains: [
          ESCAPED_CHARACTER(rawDelimiter),
          INTERPOLATION(rawDelimiter)
        ]
      });
      const STRING = {
        className: "string",
        variants: [
          MULTILINE_STRING(),
          MULTILINE_STRING("#"),
          MULTILINE_STRING("##"),
          MULTILINE_STRING("###"),
          SINGLE_LINE_STRING(),
          SINGLE_LINE_STRING("#"),
          SINGLE_LINE_STRING("##"),
          SINGLE_LINE_STRING("###")
        ]
      };
      const QUOTED_IDENTIFIER = {
        match: concat(/`/, identifier, /`/)
      };
      const IMPLICIT_PARAMETER = {
        className: "variable",
        match: /\$\d+/
      };
      const PROPERTY_WRAPPER_PROJECTION = {
        className: "variable",
        match: `\\$${identifierCharacter}+`
      };
      const IDENTIFIERS = [
        QUOTED_IDENTIFIER,
        IMPLICIT_PARAMETER,
        PROPERTY_WRAPPER_PROJECTION
      ];
      const AVAILABLE_ATTRIBUTE = {
        match: /(@|#(un)?)available/,
        className: "keyword",
        starts: {
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              keywords: availabilityKeywords,
              contains: [
                ...OPERATORS,
                NUMBER,
                STRING
              ]
            }
          ]
        }
      };
      const KEYWORD_ATTRIBUTE = {
        className: "keyword",
        match: concat(/@/, either(...keywordAttributes))
      };
      const USER_DEFINED_ATTRIBUTE = {
        className: "meta",
        match: concat(/@/, identifier)
      };
      const ATTRIBUTES = [
        AVAILABLE_ATTRIBUTE,
        KEYWORD_ATTRIBUTE,
        USER_DEFINED_ATTRIBUTE
      ];
      const TYPE = {
        match: lookahead(/\b[A-Z]/),
        relevance: 0,
        contains: [
          {
            // Common Apple frameworks, for relevance boost
            className: "type",
            match: concat(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, identifierCharacter, "+")
          },
          {
            // Type identifier
            className: "type",
            match: typeIdentifier,
            relevance: 0
          },
          {
            // Optional type
            match: /[?!]+/,
            relevance: 0
          },
          {
            // Variadic parameter
            match: /\.\.\./,
            relevance: 0
          },
          {
            // Protocol composition
            match: concat(/\s+&\s+/, lookahead(typeIdentifier)),
            relevance: 0
          }
        ]
      };
      const GENERIC_ARGUMENTS = {
        begin: /</,
        end: />/,
        keywords: KEYWORDS,
        contains: [
          ...COMMENTS,
          ...KEYWORD_MODES,
          ...ATTRIBUTES,
          OPERATOR_GUARD,
          TYPE
        ]
      };
      TYPE.contains.push(GENERIC_ARGUMENTS);
      const TUPLE_ELEMENT_NAME = {
        match: concat(identifier, /\s*:/),
        keywords: "_|0",
        relevance: 0
      };
      const TUPLE = {
        begin: /\(/,
        end: /\)/,
        relevance: 0,
        keywords: KEYWORDS,
        contains: [
          "self",
          TUPLE_ELEMENT_NAME,
          ...COMMENTS,
          ...KEYWORD_MODES,
          ...BUILT_INS,
          ...OPERATORS,
          NUMBER,
          STRING,
          ...IDENTIFIERS,
          ...ATTRIBUTES,
          TYPE
        ]
      };
      const GENERIC_PARAMETERS = {
        begin: /</,
        end: />/,
        contains: [
          ...COMMENTS,
          TYPE
        ]
      };
      const FUNCTION_PARAMETER_NAME = {
        begin: either(
          lookahead(concat(identifier, /\s*:/)),
          lookahead(concat(identifier, /\s+/, identifier, /\s*:/))
        ),
        end: /:/,
        relevance: 0,
        contains: [
          {
            className: "keyword",
            match: /\b_\b/
          },
          {
            className: "params",
            match: identifier
          }
        ]
      };
      const FUNCTION_PARAMETERS = {
        begin: /\(/,
        end: /\)/,
        keywords: KEYWORDS,
        contains: [
          FUNCTION_PARAMETER_NAME,
          ...COMMENTS,
          ...KEYWORD_MODES,
          ...OPERATORS,
          NUMBER,
          STRING,
          ...ATTRIBUTES,
          TYPE,
          TUPLE
        ],
        endsParent: true,
        illegal: /["']/
      };
      const FUNCTION = {
        match: [
          /func/,
          /\s+/,
          either(QUOTED_IDENTIFIER.match, identifier, operator)
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          GENERIC_PARAMETERS,
          FUNCTION_PARAMETERS,
          WHITESPACE
        ],
        illegal: [
          /\[/,
          /%/
        ]
      };
      const INIT_SUBSCRIPT = {
        match: [
          /\b(?:subscript|init[?!]?)/,
          /\s*(?=[<(])/
        ],
        className: {
          1: "keyword"
        },
        contains: [
          GENERIC_PARAMETERS,
          FUNCTION_PARAMETERS,
          WHITESPACE
        ],
        illegal: /\[|%/
      };
      const OPERATOR_DECLARATION = {
        match: [
          /operator/,
          /\s+/,
          operator
        ],
        className: {
          1: "keyword",
          3: "title"
        }
      };
      const PRECEDENCEGROUP = {
        begin: [
          /precedencegroup/,
          /\s+/,
          typeIdentifier
        ],
        className: {
          1: "keyword",
          3: "title"
        },
        contains: [TYPE],
        keywords: [
          ...precedencegroupKeywords,
          ...literals
        ],
        end: /}/
      };
      for (const variant of STRING.variants) {
        const interpolation = variant.contains.find((mode) => mode.label === "interpol");
        interpolation.keywords = KEYWORDS;
        const submodes = [
          ...KEYWORD_MODES,
          ...BUILT_INS,
          ...OPERATORS,
          NUMBER,
          STRING,
          ...IDENTIFIERS
        ];
        interpolation.contains = [
          ...submodes,
          {
            begin: /\(/,
            end: /\)/,
            contains: [
              "self",
              ...submodes
            ]
          }
        ];
      }
      return {
        name: "Swift",
        keywords: KEYWORDS,
        contains: [
          ...COMMENTS,
          FUNCTION,
          INIT_SUBSCRIPT,
          {
            beginKeywords: "struct protocol class extension enum actor",
            end: "\\{",
            excludeEnd: true,
            keywords: KEYWORDS,
            contains: [
              hljs.inherit(hljs.TITLE_MODE, {
                className: "title.class",
                begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/
              }),
              ...KEYWORD_MODES
            ]
          },
          OPERATOR_DECLARATION,
          PRECEDENCEGROUP,
          {
            beginKeywords: "import",
            end: /$/,
            contains: [...COMMENTS],
            relevance: 0
          },
          ...KEYWORD_MODES,
          ...BUILT_INS,
          ...OPERATORS,
          NUMBER,
          STRING,
          ...IDENTIFIERS,
          ...ATTRIBUTES,
          TYPE,
          TUPLE
        ]
      };
    }
    module.exports = swift;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/yaml.js
var require_yaml = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/yaml.js"(exports, module) {
    function yaml(hljs) {
      const LITERALS = "true false yes no null";
      const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
      const KEY = {
        className: "attr",
        variants: [
          {
            begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)"
          },
          {
            // double quoted keys
            begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'
          },
          {
            // single quoted keys
            begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"
          }
        ]
      };
      const TEMPLATE_VARIABLES = {
        className: "template-variable",
        variants: [
          {
            // jinja templates Ansible
            begin: /\{\{/,
            end: /\}\}/
          },
          {
            // Ruby i18n
            begin: /%\{/,
            end: /\}/
          }
        ]
      };
      const STRING = {
        className: "string",
        relevance: 0,
        variants: [
          {
            begin: /'/,
            end: /'/
          },
          {
            begin: /"/,
            end: /"/
          },
          {
            begin: /\S+/
          }
        ],
        contains: [
          hljs.BACKSLASH_ESCAPE,
          TEMPLATE_VARIABLES
        ]
      };
      const CONTAINER_STRING = hljs.inherit(STRING, {
        variants: [
          {
            begin: /'/,
            end: /'/
          },
          {
            begin: /"/,
            end: /"/
          },
          {
            begin: /[^\s,{}[\]]+/
          }
        ]
      });
      const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
      const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
      const FRACTION_RE = "(\\.[0-9]*)?";
      const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
      const TIMESTAMP = {
        className: "number",
        begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
      };
      const VALUE_CONTAINER = {
        end: ",",
        endsWithParent: true,
        excludeEnd: true,
        keywords: LITERALS,
        relevance: 0
      };
      const OBJECT = {
        begin: /\{/,
        end: /\}/,
        contains: [VALUE_CONTAINER],
        illegal: "\\n",
        relevance: 0
      };
      const ARRAY = {
        begin: "\\[",
        end: "\\]",
        contains: [VALUE_CONTAINER],
        illegal: "\\n",
        relevance: 0
      };
      const MODES = [
        KEY,
        {
          className: "meta",
          begin: "^---\\s*$",
          relevance: 10
        },
        {
          // multi line string
          // Blocks start with a | or > followed by a newline
          //
          // Indentation of subsequent lines must be the same to
          // be considered part of the block
          className: "string",
          begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
        },
        {
          // Ruby/Rails erb
          begin: "<%[%=-]?",
          end: "[%-]?%>",
          subLanguage: "ruby",
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0
        },
        {
          // named tags
          className: "type",
          begin: "!\\w+!" + URI_CHARACTERS
        },
        // https://yaml.org/spec/1.2/spec.html#id2784064
        {
          // verbatim tags
          className: "type",
          begin: "!<" + URI_CHARACTERS + ">"
        },
        {
          // primary tags
          className: "type",
          begin: "!" + URI_CHARACTERS
        },
        {
          // secondary tags
          className: "type",
          begin: "!!" + URI_CHARACTERS
        },
        {
          // fragment id &ref
          className: "meta",
          begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
        },
        {
          // fragment reference *ref
          className: "meta",
          begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
        },
        {
          // array listing
          className: "bullet",
          // TODO: remove |$ hack when we have proper look-ahead support
          begin: "-(?=[ ]|$)",
          relevance: 0
        },
        hljs.HASH_COMMENT_MODE,
        {
          beginKeywords: LITERALS,
          keywords: {
            literal: LITERALS
          }
        },
        TIMESTAMP,
        // numbers are any valid C-style number that
        // sit isolated from other words
        {
          className: "number",
          begin: hljs.C_NUMBER_RE + "\\b",
          relevance: 0
        },
        OBJECT,
        ARRAY,
        STRING
      ];
      const VALUE_MODES = [...MODES];
      VALUE_MODES.pop();
      VALUE_MODES.push(CONTAINER_STRING);
      VALUE_CONTAINER.contains = VALUE_MODES;
      return {
        name: "YAML",
        case_insensitive: true,
        aliases: ["yml"],
        contains: MODES
      };
    }
    module.exports = yaml;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/typescript.js
var require_typescript = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/typescript.js"(exports, module) {
    var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    var KEYWORDS = [
      "as",
      // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends"
    ];
    var LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];
    var TYPES = [
      // Fundamental objects
      "Object",
      "Function",
      "Boolean",
      "Symbol",
      // numbers and dates
      "Math",
      "Date",
      "Number",
      "BigInt",
      // text
      "String",
      "RegExp",
      // Indexed collections
      "Array",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Int32Array",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array",
      // Keyed collections
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      // Structured data
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Atomics",
      "DataView",
      "JSON",
      // Control abstraction objects
      "Promise",
      "Generator",
      "GeneratorFunction",
      "AsyncFunction",
      // Reflection
      "Reflect",
      "Proxy",
      // Internationalization
      "Intl",
      // WebAssembly
      "WebAssembly"
    ];
    var ERROR_TYPES = [
      "Error",
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];
    var BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];
    var BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global"
      // Node.js
    ];
    var BUILT_INS = [].concat(
      BUILT_IN_GLOBALS,
      TYPES,
      ERROR_TYPES
    );
    function javascript(hljs) {
      const regex = hljs.regex;
      const hasClosingTag = (match, { after }) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
      };
      const IDENT_RE$1 = IDENT_RE;
      const FRAGMENT = {
        begin: "<>",
        end: "</>"
      };
      const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
      const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        /**
         * @param {RegExpMatchArray} match
         * @param {CallbackResponse} response
         */
        isTrulyOpeningTag: (match, response) => {
          const afterMatchIndex = match[0].length + match.index;
          const nextChar = match.input[afterMatchIndex];
          if (
            // HTML should not include another raw `<` inside a tag
            // nested type?
            // `<Array<Array<number>>`, etc.
            nextChar === "<" || // the , gives away that this is not HTML
            // `<T, A extends keyof T, V>`
            nextChar === ","
          ) {
            response.ignoreMatch();
            return;
          }
          if (nextChar === ">") {
            if (!hasClosingTag(match, { after: afterMatchIndex })) {
              response.ignoreMatch();
            }
          }
          let m;
          const afterMatch = match.input.substr(afterMatchIndex);
          if (m = afterMatch.match(/^\s+extends\s+/)) {
            if (m.index === 0) {
              response.ignoreMatch();
              return;
            }
          }
        }
      };
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS,
        "variable.language": BUILT_IN_VARIABLES
      };
      const decimalDigits = "[0-9](_?[0-9])*";
      const frac = `\\.(${decimalDigits})`;
      const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
      const NUMBER = {
        className: "number",
        variants: [
          // DecimalLiteral
          { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
          { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
          // DecimalBigIntegerLiteral
          { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
          // NonDecimalIntegerLiteral
          { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
          { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
          // LegacyOctalIntegerLiteral (does not include underscore separators)
          // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
          { begin: "\\b0[0-7]+n?\\b" }
        ],
        relevance: 0
      };
      const SUBST = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: KEYWORDS$1,
        contains: []
        // defined later
      };
      const HTML_TEMPLATE = {
        begin: "html`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "xml"
        }
      };
      const CSS_TEMPLATE = {
        begin: "css`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "css"
        }
      };
      const TEMPLATE_STRING = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      };
      const JSDOC_COMMENT = hljs.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: true,
                  excludeBegin: true,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                  endsParent: true,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      );
      const COMMENT = {
        className: "comment",
        variants: [
          JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      };
      const SUBST_INTERNALS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        NUMBER
        // This is intentional:
        // See https://github.com/highlightjs/highlight.js/issues/3288
        // hljs.REGEXP_MODE
      ];
      SUBST.contains = SUBST_INTERNALS.concat({
        // we need to pair up {} inside our subst to prevent
        // it from ending too early by matching another }
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS$1,
        contains: [
          "self"
        ].concat(SUBST_INTERNALS)
      });
      const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
      const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        // eat recursive parens in sub expressions
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS$1,
          contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
      ]);
      const PARAMS = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
      };
      const CLASS_OR_EXTENDS = {
        variants: [
          // class Car extends vehicle
          {
            match: [
              /class/,
              /\s+/,
              IDENT_RE$1,
              /\s+/,
              /extends/,
              /\s+/,
              regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
            ],
            scope: {
              1: "keyword",
              3: "title.class",
              5: "keyword",
              7: "title.class.inherited"
            }
          },
          // class Car
          {
            match: [
              /class/,
              /\s+/,
              IDENT_RE$1
            ],
            scope: {
              1: "keyword",
              3: "title.class"
            }
          }
        ]
      };
      const CLASS_REFERENCE = {
        relevance: 0,
        match: regex.either(
          // Hard coded exceptions
          /\bJSON/,
          // Float32Array, OutT
          /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
          // CSSFactory, CSSFactoryT
          /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
          // FPs, FPsT
          /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
          // P
          // single letters are not highlighted
          // BLAH
          // this will be flagged as a UPPER_CASE_CONSTANT instead
        ),
        className: "title.class",
        keywords: {
          _: [
            // se we still get relevance credit for JS library classes
            ...TYPES,
            ...ERROR_TYPES
          ]
        }
      };
      const USE_STRICT = {
        label: "use_strict",
        className: "meta",
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      };
      const FUNCTION_DEFINITION = {
        variants: [
          {
            match: [
              /function/,
              /\s+/,
              IDENT_RE$1,
              /(?=\s*\()/
            ]
          },
          // anonymous function
          {
            match: [
              /function/,
              /\s*(?=\()/
            ]
          }
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        label: "func.def",
        contains: [PARAMS],
        illegal: /%/
      };
      const UPPER_CASE_CONSTANT = {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant"
      };
      function noneOf(list) {
        return regex.concat("(?!", list.join("|"), ")");
      }
      const FUNCTION_CALL = {
        match: regex.concat(
          /\b/,
          noneOf([
            ...BUILT_IN_GLOBALS,
            "super"
          ]),
          IDENT_RE$1,
          regex.lookahead(/\(/)
        ),
        className: "title.function",
        relevance: 0
      };
      const PROPERTY_ACCESS = {
        begin: regex.concat(/\./, regex.lookahead(
          regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
        )),
        end: IDENT_RE$1,
        excludeBegin: true,
        keywords: "prototype",
        className: "property",
        relevance: 0
      };
      const GETTER_OR_SETTER = {
        match: [
          /get|set/,
          /\s+/,
          IDENT_RE$1,
          /(?=\()/
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          {
            // eat to avoid empty params
            begin: /\(\)/
          },
          PARAMS
        ]
      };
      const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
      const FUNCTION_VARIABLE = {
        match: [
          /const|var|let/,
          /\s+/,
          IDENT_RE$1,
          /\s*/,
          /=\s*/,
          /(async\s*)?/,
          // async is optional
          regex.lookahead(FUNC_LEAD_IN_RE)
        ],
        keywords: "async",
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          PARAMS
        ]
      };
      return {
        name: "Javascript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: KEYWORDS$1,
        // this will be extended by TypeScript
        exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
        illegal: /#(?![$_A-z])/,
        contains: [
          hljs.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
          }),
          USE_STRICT,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          HTML_TEMPLATE,
          CSS_TEMPLATE,
          TEMPLATE_STRING,
          COMMENT,
          NUMBER,
          CLASS_REFERENCE,
          {
            className: "attr",
            begin: IDENT_RE$1 + regex.lookahead(":"),
            relevance: 0
          },
          FUNCTION_VARIABLE,
          {
            // "value" container
            begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            relevance: 0,
            contains: [
              COMMENT,
              hljs.REGEXP_MODE,
              {
                className: "function",
                // we have to count the parens to make sure we actually have the
                // correct bounding ( ) before the =>.  There could be any number of
                // sub-expressions inside also surrounded by parens.
                begin: FUNC_LEAD_IN_RE,
                returnBegin: true,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      {
                        begin: hljs.UNDERSCORE_IDENT_RE,
                        relevance: 0
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: true
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS$1,
                        contains: PARAMS_CONTAINS
                      }
                    ]
                  }
                ]
              },
              {
                // could be a comma delimited list of params to a function call
                begin: /,/,
                relevance: 0
              },
              {
                match: /\s+/,
                relevance: 0
              },
              {
                // JSX
                variants: [
                  { begin: FRAGMENT.begin, end: FRAGMENT.end },
                  { match: XML_SELF_CLOSING },
                  {
                    begin: XML_TAG.begin,
                    // we carefully check the opening tag to see if it truly
                    // is a tag and not a false positive
                    "on:begin": XML_TAG.isTrulyOpeningTag,
                    end: XML_TAG.end
                  }
                ],
                subLanguage: "xml",
                contains: [
                  {
                    begin: XML_TAG.begin,
                    end: XML_TAG.end,
                    skip: true,
                    contains: ["self"]
                  }
                ]
              }
            ]
          },
          FUNCTION_DEFINITION,
          {
            // prevent this from getting swallowed up by function
            // since they appear "function like"
            beginKeywords: "while if switch catch for"
          },
          {
            // we have to count the parens to make sure we actually have the correct
            // bounding ( ).  There could be any number of sub-expressions inside
            // also surrounded by parens.
            begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
            // end parens
            returnBegin: true,
            label: "func.def",
            contains: [
              PARAMS,
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
            ]
          },
          // catch ... so it won't trigger the property rule below
          {
            match: /\.\.\./,
            relevance: 0
          },
          PROPERTY_ACCESS,
          // hack: prevents detection of keywords in some circumstances
          // .keyword()
          // $keyword = x
          {
            match: "\\$" + IDENT_RE$1,
            relevance: 0
          },
          {
            match: [/\bconstructor(?=\s*\()/],
            className: { 1: "title.function" },
            contains: [PARAMS]
          },
          FUNCTION_CALL,
          UPPER_CASE_CONSTANT,
          CLASS_OR_EXTENDS,
          GETTER_OR_SETTER,
          {
            match: /\$[(.]/
            // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
          }
        ]
      };
    }
    function typescript(hljs) {
      const tsLanguage = javascript(hljs);
      const IDENT_RE$1 = IDENT_RE;
      const TYPES2 = [
        "any",
        "void",
        "number",
        "boolean",
        "string",
        "object",
        "never",
        "enum"
      ];
      const NAMESPACE = {
        beginKeywords: "namespace",
        end: /\{/,
        excludeEnd: true,
        contains: [
          tsLanguage.exports.CLASS_REFERENCE
        ]
      };
      const INTERFACE = {
        beginKeywords: "interface",
        end: /\{/,
        excludeEnd: true,
        keywords: {
          keyword: "interface extends",
          built_in: TYPES2
        },
        contains: [
          tsLanguage.exports.CLASS_REFERENCE
        ]
      };
      const USE_STRICT = {
        className: "meta",
        relevance: 10,
        begin: /^\s*['"]use strict['"]/
      };
      const TS_SPECIFIC_KEYWORDS = [
        "type",
        "namespace",
        "typedef",
        "interface",
        "public",
        "private",
        "protected",
        "implements",
        "declare",
        "abstract",
        "readonly"
      ];
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS.concat(TS_SPECIFIC_KEYWORDS),
        literal: LITERALS,
        built_in: BUILT_INS.concat(TYPES2),
        "variable.language": BUILT_IN_VARIABLES
      };
      const DECORATOR = {
        className: "meta",
        begin: "@" + IDENT_RE$1
      };
      const swapMode = (mode, label, replacement) => {
        const indx = mode.contains.findIndex((m) => m.label === label);
        if (indx === -1) {
          throw new Error("can not find mode to replace");
        }
        mode.contains.splice(indx, 1, replacement);
      };
      Object.assign(tsLanguage.keywords, KEYWORDS$1);
      tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
      tsLanguage.contains = tsLanguage.contains.concat([
        DECORATOR,
        NAMESPACE,
        INTERFACE
      ]);
      swapMode(tsLanguage, "shebang", hljs.SHEBANG());
      swapMode(tsLanguage, "use_strict", USE_STRICT);
      const functionDeclaration = tsLanguage.contains.find((m) => m.label === "func.def");
      functionDeclaration.relevance = 0;
      Object.assign(tsLanguage, {
        name: "TypeScript",
        aliases: ["ts", "tsx"]
      });
      return tsLanguage;
    }
    module.exports = typescript;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/vbnet.js
var require_vbnet = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/languages/vbnet.js"(exports, module) {
    function vbnet(hljs) {
      const regex = hljs.regex;
      const CHARACTER = {
        className: "string",
        begin: /"(""|[^/n])"C\b/
      };
      const STRING = {
        className: "string",
        begin: /"/,
        end: /"/,
        illegal: /\n/,
        contains: [
          {
            // double quote escape
            begin: /""/
          }
        ]
      };
      const MM_DD_YYYY = /\d{1,2}\/\d{1,2}\/\d{4}/;
      const YYYY_MM_DD = /\d{4}-\d{1,2}-\d{1,2}/;
      const TIME_12H = /(\d|1[012])(:\d+){0,2} *(AM|PM)/;
      const TIME_24H = /\d{1,2}(:\d{1,2}){1,2}/;
      const DATE = {
        className: "literal",
        variants: [
          {
            // #YYYY-MM-DD# (ISO-Date) or #M/D/YYYY# (US-Date)
            begin: regex.concat(/# */, regex.either(YYYY_MM_DD, MM_DD_YYYY), / *#/)
          },
          {
            // #H:mm[:ss]# (24h Time)
            begin: regex.concat(/# */, TIME_24H, / *#/)
          },
          {
            // #h[:mm[:ss]] A# (12h Time)
            begin: regex.concat(/# */, TIME_12H, / *#/)
          },
          {
            // date plus time
            begin: regex.concat(
              /# */,
              regex.either(YYYY_MM_DD, MM_DD_YYYY),
              / +/,
              regex.either(TIME_12H, TIME_24H),
              / *#/
            )
          }
        ]
      };
      const NUMBER = {
        className: "number",
        relevance: 0,
        variants: [
          {
            // Float
            begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
          },
          {
            // Integer (base 10)
            begin: /\b\d[\d_]*((U?[SIL])|[%&])?/
          },
          {
            // Integer (base 16)
            begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/
          },
          {
            // Integer (base 8)
            begin: /&O[0-7_]+((U?[SIL])|[%&])?/
          },
          {
            // Integer (base 2)
            begin: /&B[01_]+((U?[SIL])|[%&])?/
          }
        ]
      };
      const LABEL = {
        className: "label",
        begin: /^\w+:/
      };
      const DOC_COMMENT = hljs.COMMENT(/'''/, /$/, {
        contains: [
          {
            className: "doctag",
            begin: /<\/?/,
            end: />/
          }
        ]
      });
      const COMMENT = hljs.COMMENT(null, /$/, {
        variants: [
          {
            begin: /'/
          },
          {
            // TODO: Use multi-class for leading spaces
            begin: /([\t ]|^)REM(?=\s)/
          }
        ]
      });
      const DIRECTIVES = {
        className: "meta",
        // TODO: Use multi-class for indentation once available
        begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
        end: /$/,
        keywords: {
          keyword: "const disable else elseif enable end externalsource if region then"
        },
        contains: [COMMENT]
      };
      return {
        name: "Visual Basic .NET",
        aliases: ["vb"],
        case_insensitive: true,
        classNameAliases: {
          label: "symbol"
        },
        keywords: {
          keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
          built_in: (
            // Operators https://docs.microsoft.com/dotnet/visual-basic/language-reference/operators
            "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort"
          ),
          type: (
            // Data types https://docs.microsoft.com/dotnet/visual-basic/language-reference/data-types
            "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort"
          ),
          literal: "true false nothing"
        },
        illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
        contains: [
          CHARACTER,
          STRING,
          DATE,
          NUMBER,
          LABEL,
          DOC_COMMENT,
          COMMENT,
          DIRECTIVES
        ]
      };
    }
    module.exports = vbnet;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/common.js
var require_common = __commonJS({
  "../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/lib/common.js"(exports, module) {
    var hljs = require_core();
    hljs.registerLanguage("xml", require_xml());
    hljs.registerLanguage("bash", require_bash());
    hljs.registerLanguage("c", require_c());
    hljs.registerLanguage("cpp", require_cpp());
    hljs.registerLanguage("csharp", require_csharp());
    hljs.registerLanguage("css", require_css());
    hljs.registerLanguage("markdown", require_markdown());
    hljs.registerLanguage("diff", require_diff());
    hljs.registerLanguage("ruby", require_ruby());
    hljs.registerLanguage("go", require_go());
    hljs.registerLanguage("ini", require_ini());
    hljs.registerLanguage("java", require_java());
    hljs.registerLanguage("javascript", require_javascript());
    hljs.registerLanguage("json", require_json());
    hljs.registerLanguage("kotlin", require_kotlin());
    hljs.registerLanguage("less", require_less());
    hljs.registerLanguage("lua", require_lua());
    hljs.registerLanguage("makefile", require_makefile());
    hljs.registerLanguage("perl", require_perl());
    hljs.registerLanguage("objectivec", require_objectivec());
    hljs.registerLanguage("php", require_php());
    hljs.registerLanguage("php-template", require_php_template());
    hljs.registerLanguage("plaintext", require_plaintext());
    hljs.registerLanguage("python", require_python());
    hljs.registerLanguage("python-repl", require_python_repl());
    hljs.registerLanguage("r", require_r());
    hljs.registerLanguage("rust", require_rust());
    hljs.registerLanguage("scss", require_scss());
    hljs.registerLanguage("shell", require_shell());
    hljs.registerLanguage("sql", require_sql());
    hljs.registerLanguage("swift", require_swift());
    hljs.registerLanguage("yaml", require_yaml());
    hljs.registerLanguage("typescript", require_typescript());
    hljs.registerLanguage("vbnet", require_vbnet());
    hljs.HighlightJS = hljs;
    hljs.default = hljs;
    module.exports = hljs;
  }
});

// ../../node_modules/.pnpm/highlight.js@11.4.0/node_modules/highlight.js/es/common.js
var import_common = __toESM(require_common());
var common_default = import_common.default;
var export_HighlightJS = import_common.default;
export {
  export_HighlightJS as HighlightJS,
  common_default as default
};
//# sourceMappingURL=highlight__js_lib_common.js.map
