
var gl, program;
function main() {
	var canvas = document.getElementById('webgl');
	gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to find context');
	}

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	gl.program = program;
	render(gl, program, 0);
	var GUIInit = function () {
		this.rotate = 0.01;
	};
	var text = new GUIInit();
	var gui = new dat.GUI();
	var controlPanel = gui.add(text, 'rotate', 0, 3);


	controlPanel.onChange(function (value) {
		rotateShape(value);
	});
}


function rotateShape(value) {
	render(gl, program, value);
}

function render(gl, program, value) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var hexvertices = [
		-0.15, 0.25,
		0.15, 0.25,
		0.3, 0,
		0.15, -0.25,
		-0.15, -0.25,
		-0.3, 0
	];
	var numberOfVertices = initVertices(program, gl, hexvertices);

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [-0.5, 0.0, 0.0]);
	mat4.rotateZ(mvMatrix, mvMatrix, value);
	initTransformations(gl, mvMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices);
	mvPushMatrix();

	var penvertices = [
		-0.25, 0,
		0, 0.25,
		0.25, 0,
		0.15, -0.25,
		-0.15, -0.25
	];
	var numberOfVertices = initVertices(program, gl, penvertices);

	mat4.identity(mvMatrix);

	mat4.translate(mvMatrix, mvMatrix, [0.5, 0.0, 0.0]);
	mat4.rotateZ(mvMatrix, mvMatrix, value);
	initTransformations(gl, mvMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices);
	mvPushMatrix();
}


function initTransformations(gl, modelMatrix) {
	var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
	gl.uniformMatrix4fv(transformationMatrix, false, flatten(modelMatrix));

}

function initVertices(program, gl, vertices) {
	var vertices = vertices;
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;

	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) { console.log('Failed to create the buffer object '); return -1; }

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log("Failed to Get Position"); return; }

	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	return numberOfVertices;
}