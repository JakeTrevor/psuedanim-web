grammar Pseudanim

entry Module:
    (statements+=Statement)*
;

fragment Block:
    '{' (statements+=Statement)* '}'
;

Statement:
    Assignment | For | While | If | Expression
;

If:
    'if' condition=Expression Block
;

While:
    'while' condition=Expression Block
;

For:
    'for' var=ID 'in' arr=Expression Block
;

Assignment:
    name=ID (path=Access)? '=' val=(Expression)
;


// operator precedence: B I DM AS mod cmp eq lgc

Expression:
    Lgc;

SimpleExpression:
    Literal
    | SubExpression
    | Ref
;

Literal:
    value=(STRING | NUMBER | BooleanLiteral | ArrayLiteral)
;

SubExpression:
    '(' value=Expression ')'
;

Ref:
    ref=[Assignment] (access=Access)?
;

Pow infers Expression:
    SimpleExpression ({infer BinaryExpression.left=current} op="^" right=SimpleExpression)*
;

Mul infers Expression:
    Pow ({infer BinaryExpression.left=current} op=("*"|"/") right=Pow)*
;

Add infers Expression:
    Mul ({infer BinaryExpression.left=current} op=("+"|"-") right=Mul)*
;

Mod infers Expression:
    Add ({infer BinaryExpression.left=current} op="%" right=Add)*
;

Cmp infers Expression:
    Mod ({infer BinaryExpression.left=current} op=("<"|">"|"<="|">=") right=Mod)*
;

Eq infers Expression:
    Cmp ({infer BinaryExpression.left=current} op=("!="|"==") right=Cmp)*
;

Lgc infers Expression:
    Eq ({infer BinaryExpression.left=current} op=("and"|"or") right=Eq)*
;


ArrayLiteral:
    '[' contents+=(RangeExpression | Expression)? (',' contents+=(RangeExpression | Expression))*']'
;

RangeExpression:
    start=Expression 'to' end=Expression
;

Access:
    (('[' path+=Expression ']') | (('.' path+=ID)))+
;


BooleanLiteral:
    value?='true' | 'false';

hidden terminal WS: /\s+/;

terminal STRING returns string: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal NUMBER returns number: /(?:(?:-?[0-9]+)?\.[0-9]+)|-?[0-9]+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;