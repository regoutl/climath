

let lp;

let result = {}, objective, i;


let problemText = `
Maximize
obj: + 786433 x1 + 655361 x2 + 589825 x3 + 557057 x4
+ 540673 x5 + 532481 x6 + 528385 x7 + 526337 x8 + 525313 x9
+ 524801 x10 + 524545 x11 + 524417 x12 + 524353 x13
+ 524321 x14 + 524305 x15

Subject To
cap: + 786433 x1 + 655361 x2 + 589825 x3 + 557057 x4
+ 540673 x5 + 532481 x6 + 528385 x7 + 526337 x8 + 525313 x9
+ 524801 x10 + 524545 x11 + 524417 x12 + 524353 x13
+ 524321 x14 + 524305 x15 <= 4194303.5

Bounds
0 <= x1 <= 1
0 <= x2 <= 1
0 <= x3 <= 1
0 <= x4 <= 1
0 <= x5 <= 1
0 <= x6 <= 1
0 <= x7 <= 1
0 <= x8 <= 1
0 <= x9 <= 1
0 <= x10 <= 1
0 <= x11 <= 1
0 <= x12 <= 1
0 <= x13 <= 1
0 <= x14 <= 1
0 <= x15 <= 1

End
`;

lp = glp_create_prob();
glp_read_lp_from_string(lp, null, problemText);

glp_scale_prob(lp, GLP_SF_AUTO);

var smcp = new SMCP({presolve: GLP_ON});
glp_simplex(lp, smcp);

objective = glp_get_obj_val(lp);
for(i = 1; i <= glp_get_num_cols(lp); i++){
    result[glp_get_col_name(lp, i)] = glp_get_col_prim (lp, i);
}

console.log(result);

lp = null;
