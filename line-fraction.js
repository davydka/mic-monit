const spawn = require('child_process').spawn;
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();
// const py = spawn('python', ['monit.py'])
const py = spawn("stdbuf", ["-oL", "-eL", "python", "monit.py"]);

let values = [];
const max = 100;
py.stdout.on('data', function(data){
  values.push(parseInt(data));
  
  if(values.length > max) {
    values.shift()
  }
  update()
  
});

const line = contrib.line({
  // width: 80,
  // height: 30,
  left: 0,
  top: 0,
  xLabelPadding: 0,
  maxY: 20000,
  label: 'Mic Level',
  numYLabels: 5
})

let xLabel = [];
for(var i = 0; i < 100; ++i) { xLabel.push(' '); }
const data = [
  {
    title: 'cool title',
    x: xLabel,
    y: [0, 0.0695652173913043, 0.11304347826087, 2],
    style: {
      line: 'red'
    }
  }
];


screen.append(line) //must append before setting data
line.setData(data)

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  py.kill('SIGHUP');
  return process.exit(0);
});

screen.render()

function update() {
  const data = [
    {
      title: 'cool title',
      x: xLabel,
      y: values,
      style: {
        line: 'red'
      }
    }
  ];

  line.setData(data);
  screen.render()
}
