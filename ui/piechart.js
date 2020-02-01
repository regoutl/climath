

export function pieChart(ctx, values, palette) {
  var defaultColors = ['red', 'green', 'blue', 'yellow', 'pink'];

  var vals = Object.entries(values);

  vals.sort(function (a, b) {
    return b[1] - a[1];
  });

  //compute sum
  var sum = 0;
  vals.forEach(function (it) {
    sum += it[1];
  });

  // ctx.strokeStyle = 'white';
  // ctx.lineWidth = '2';
  ctx.font = "14px Arial";

  var angle = -3.14 / 2;
  vals.forEach(function (it, index) {
    var importance = it[1] / sum * 2 * Math.PI;
    ctx.beginPath();

    var a = angle;
    var b = angle + importance - 0.01;
    b = Math.max(b, a);
    ctx.arc(0, 0, 50, a, b);
    ctx.lineTo(0, 0);
    angle += importance;
    if (palette === undefined) ctx.fillStyle = defaultColors[index];else ctx.fillStyle = palette[it[0]];
    ctx.fill();

    var perc = Math.round(it[1] / sum * 100);
    if (index < 4 && perc >= 1) {
      ctx.fillRect(60, -38 + 18 * index, 8, 8);
      ctx.fillStyle = 'black';
      perc = String(perc);
      if (perc.length < 2) perc = " " + perc;

      ctx.fillText(perc + " % : " + it[0], 75, -30 + 18 * index);
    }
  });
}