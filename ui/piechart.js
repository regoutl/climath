

export    function pieChart(ctx, values, palette){
  let defaultColors = ['red', 'green', 'blue', 'yellow', 'pink'];

  let vals = Object.entries(values);

  vals.sort((a, b) => b[1] - a[1]);

  //compute sum
  let sum = 0;
  vals.forEach(it => {  sum += it[1];});

  let angle = 0;
  vals.forEach((it, index) => {
    let importance = it[1] / sum * 2 * Math.PI;
    console.log(it[0], it[1], importance);
    ctx.beginPath();
    ctx.arc(0, 0, 50, angle, angle + importance);
    ctx.lineTo(0, 0);
    angle += importance;
    if(palette === undefined)
      ctx.fillStyle   = defaultColors[index];
    else
      ctx.fillStyle   = palette[it[0]];
    ctx.fill();
  });
}
