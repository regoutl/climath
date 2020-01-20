export class Matrix{
  constructor(rows, columns = 1, arr){
    rows = Number(rows);
    columns = Number(columns);
    if(isNaN(rows) || isNaN(columns))
      throw 'pas des nombres';

    this.data = new Float32Array(rows * columns);
    this.rows = rows;
    this.cols = columns;

    if(arr !== undefined){
      if(arr.length != this.data.length)
        throw 'pas la bonne taille';
      for(let i = 0; i < arr.length; i++)
        this.data[i] = arr[i];
    }
  }

  get(r, c = 0){
    return this.data[r * this.cols + c];
  }
  set(r, c, val){
    if(val === undefined){
      val = c;
      c = 0;
    }

    this.data[r * this.cols + c] = val;
  }

  resize(rows, cols = 1){
    let nd = new Float32Array(rows * cols);
    for(let i = 0; i < Math.min(rows, this.rows); i++)
      for(let j = 0; j < Math.min(cols, this.cols); j++)
        nd[i * cols + j] = this.data[i * this.cols + j];

    this.data = nd;
    this.rows = rows;
    this.cols = cols;
  }

  setRect(x, y, rows, cols, array){
    if(array.length != rows * cols)
      throw 'hun';

    for(let r = 0; r < rows; r++)
      for(let c = 0; c < cols; c++)
        this.set(r + x, c + y, array[r * cols + c]);
  }

  print(){
    for(let r = 0; r < this.rows; r++){
      let txt = ""
      for(let c = 0; c < this.cols; c++)
        txt += Math.round(this.get(r, c)*100)/100 + " ";

      console.log(txt);
    }

  }
}


/**
transform max C'x
s.t Ax <= b
s.t x >= 0

into max C' x'
s.t. A'x' = B'
s.t. x' >= 0
x' := [x, s]'
*/
export function stdToCan(problemStd){
  let iA = problemStd.A;
  let iB = problemStd.B;
  let iC = problemStd.C;

  //first, do some checks of the matrix format
  if(iC.cols != 1 || iA.cols != iC.rows || iA.rows != iB.rows)
    throw 'incompatiblee matrices';

  let nVar = iC.rows;
  let nConstrains = iA.rows;

  iA.resize(nConstrains, nVar + nConstrains);
  iC.resize(nVar + nConstrains);

  for(let i = 0; i < nConstrains; i++){
    iA.set(i, i + nVar, 1);
  }

}

/** solve
max C'x
s.t Ax = B
x >= 0
*/
export function solveCan(problem){
  let iA = problem.A;
  let iB = problem.B;
  let iC = problem.C;


  let nConstrains = iA.rows;
  let nVar = iA.cols; //'real vars' and 'slack vars'

  let nSlack = nConstrains;
  let nPrimVar = nVar - nSlack;


  //build the one :
  // C 0
  // A B
  let theOne = new Matrix(iA.rows + 1, iA.cols + 1);


  for(let j = 0; j < iA.cols; j++)
    theOne.set(0, j, iC.get(j));

  for(let i = 0; i < iA.rows; i++){
    for(let j = 0; j < iA.cols; j++)
      theOne.set(i+1, j, iA.get(i, j));

    theOne.set(i+1, iA.cols, iB.get(i));
  }

  //iterate
  let nIt = 10;
  while(nIt > 0){
    nIt--;
    let pivotIndex = 0;
    for(; pivotIndex < nVar && theOne.get(0, pivotIndex) <= 0; pivotIndex++);

    if(pivotIndex == nVar) //done !
      break;

    //find relevant constain :
    let minIndex = -1;
    let minVal = Infinity;
    for(let i = 1; i < nConstrains + 1; i++){
      let prop = theOne.get(i, iA.cols) / theOne.get(i, pivotIndex)
      if(prop > 0 && prop < minVal){
        minVal = prop;
        minIndex = i;
      }
    }

    if(minIndex == -1)
      throw 'whut ?';

    //put the pivot var at a coef of 1 on this constraint line
    let inv = 1 /  theOne.get(minIndex, pivotIndex);
    for(let i = 0; i < nVar + 1; i++)
      theOne.set(minIndex, i, theOne.get(minIndex, i) * inv);


    //eliminate the var on the other rows
    for( let r = 0; r < nConstrains + 1; r++){
      if(r == minIndex) continue;

      let itsCoef = - theOne.get(r, pivotIndex);

      for(let i = 0; i < nVar + 1; i++)
        theOne.set(r, i, theOne.get(r, i) + itsCoef * theOne.get(minIndex, i) );
    }
  }

  if(nIt == 0)
    throw 'ca fait bcp d iteration ca. pe un ctcle => sol pe pas opti';

  //read the solution
  // let optimum = -theOne.get(0, nVar);

  let ans = new Matrix(nPrimVar, 1);

  for(let i = 0; i < nPrimVar; i++){
    if(theOne.get(0, i) < 0)
      ans.set(i, 0, 0);
    else{
      for(let j = 1; j < nConstrains + 1; j++){
        if(theOne.get(j, i) == 1)
          ans.set(i, 0, theOne.get(j, nVar));
      }
    }
  }



  return ans;
}


/** @brief
 solve problems :
  max C'x
  s.t. Ax = b
  s.t. x >= 0

@param obj : array C
@param constains : Array interpreted as (A | B)

@details

exemple d'utilisation :
max 3x + 2y
s.t. 2x +  y = 18
s.t. 2x + 3y = 42
s.t. 3x +  y = 24
s.t. x, y >= 0

simplex([3, 2,  0],
      [  2, 1, 18,
      	 2, 3, 42,
      	 3, 1, 24]);


  @return array x

  @note inputs are modified
*/
export function simplex(obj, constrains){
  let nVar = obj.length - 1;
  let nConstrains = constrains.length / (nVar + 1);

  if(!Number.isInteger(nConstrains))
    throw 'ill form contrains';


  //iterate
  let nIt = nVar * 2;
  while(nIt > 0){

    nIt--;
    let pivotIndex = 0;
    for(; pivotIndex < nVar && obj[pivotIndex] <= 0; pivotIndex++);

    // console.log('iteration :');
    // //show
    // let line = '';
    // for(let i = 0; i < nVar + 1; i++)
    //   line += ' ' + obj[i];
    // console.log(line);
    // for(let j = 0; j < nConstrains; j++){
    //   line = '';
    //   for(let i = 0; i < nVar + 1; i++)
    //     line += ' ' + constrains[j * (nVar + 1) + i];
    //   console.log(line);
    // }


    if(pivotIndex == nVar) //done !
      break;

    //find relevant constain :
    let minIndex = -1;
    let minVal = Infinity;
    for(let i = 0; i < nConstrains; i++){
      let prop = constrains[i * (nVar + 1) + nVar] / constrains[i* (nVar + 1) + pivotIndex];
      if(prop >= 0 && prop < minVal){
        minVal = prop;
        minIndex = i;
      }
    }

    if(minIndex == -1)
      throw 'whut ?';

    //put the pivot var at a coef of 1 on this constraint line
    let inv = 1 /  constrains[minIndex* (nVar + 1) + pivotIndex];
    // alert(inv);
    for(let i = 0; i < nVar + 1; i++)
      constrains[minIndex* (nVar + 1) + i] *= inv;


    //eliminate the var on the other rows
    for( let r = 0; r < nConstrains; r++){
      if(r == minIndex) continue;

      let itsCoef = - constrains[r* (nVar + 1) +  pivotIndex];

      for(let i = 0; i < nVar + 1; i++)
        constrains[r* (nVar + 1) +  i] += itsCoef * constrains[minIndex* (nVar + 1) + i];
    }

    //and on obj function

    let itsCoef = - obj[pivotIndex];
    for(let i = 0; i < nVar + 1; i++)
      obj[i] += itsCoef * constrains[minIndex* (nVar + 1) + i];

  }

  if(nIt == 0)
    throw 'ca fait bcp d iteration ca. pe un ctcle => sol pe pas opti';

  //read the solution
  // let optimum = -obj[nVar];

  let ans = new Float32Array(nVar);

  for(let i = 0; i < nVar; i++){
    if(obj[i] >= 0){
      for(let j = 0; j < nConstrains + 0; j++){
        if(constrains[j * (nVar + 1) + i] == 1)
          ans[i] = constrains[j * (nVar + 1) + nVar];
      }
    }
  }



  return ans;

}
