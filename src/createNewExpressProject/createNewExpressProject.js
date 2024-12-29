"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewExpressProject = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const vscode = __importStar(require("vscode"));
const adm_zip_1 = __importDefault(require("adm-zip"));
exports.createNewExpressProject = vscode.commands.registerCommand('modular-express.createNewExpressProject', async () => {
    // Prompt for project name
    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter the project name',
        validateInput: (input) => input ? null : 'Project name cannot be empty',
    });
    if (!projectName) {
        return;
    }
    // Prompt for project description
    const projectDescription = await vscode.window.showInputBox({
        prompt: 'Enter the project description (optional)',
    });
    // Ask for folder to create project
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select folder for the project',
    });
    if (!folderUri || folderUri.length === 0) {
        vscode.window.showErrorMessage('No folder selected.');
        return;
    }
    const projectPath = path.join(folderUri[0].fsPath, projectName);
    if (fs_extra_1.default.existsSync(projectPath)) {
        vscode.window.showErrorMessage('A project with this name already exists in the selected folder.');
        return;
    }
    fs_extra_1.default.mkdirSync(projectPath);
    vscode.window.showInformationMessage(`Creating project ${projectName}...`);
    // Initialize the package.json file
    const packageJson = {
        name: projectName,
        version: '1.0.0',
        description: projectDescription || '',
        main: 'index.js',
        scripts: {
            build: 'tsc',
            prod: 'node ./dist/server.js',
            dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
            lint: 'eslint src',
            format: 'prettier --ignore-path .gitignore --write "**/*.+(js|ts|json)"',
            'format:fix': 'npx prettier --write src',
            test: 'echo "Error: no test specified" && exit 1',
        },
        dependencies: {},
        devDependencies: {},
    };
    fs_extra_1.default.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
    // Extract templates/src.zip into projectPath
    const zipFilePath = path.join(__dirname, 'src', 'templates', 'src.zip'); // Path to your src.zip file
    try {
        const zip = new adm_zip_1.default(zipFilePath);
        zip.extractAllTo(projectPath, true); // Extract to the projectPath, overwriting any existing files if necessary
        vscode.window.showInformationMessage('Project template extracted successfully!');
    }
    catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error extracting template: ${error.message}`);
        }
    }
    // Open project in a new VS Code window
    await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath), true);
    // Install dependencies and devDependencies after opening the project
    const installDependencies = () => {
        const dependencies = ['express', 'cors', 'mongoose', 'zod', 'dotenv'];
        const devDependencies = ['typescript', 'ts-node-dev', 'prettier', 'eslint', '@types/node', '@types/express'];
        (0, child_process_1.exec)(`npm install ${dependencies.join(' ')}`, { cwd: projectPath }, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage('Failed to install dependencies');
                console.error(stderr);
                return;
            }
            vscode.window.showInformationMessage('Dependencies installed successfully');
        });
        (0, child_process_1.exec)(`npm install -D ${devDependencies.join(' ')}`, { cwd: projectPath }, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage('Failed to install devDependencies');
                console.error(stderr);
                return;
            }
            vscode.window.showInformationMessage('DevDependencies installed successfully');
        });
    };
    vscode.window.showInformationMessage('Installing dependencies. This might take a while...');
    installDependencies();
    // Generate additional config files
    const tsConfig = {
        compilerOptions: {
            outDir: './dist',
            module: 'commonjs',
            target: 'ES6',
            esModuleInterop: true,
            strict: true,
            baseUrl: './',
        },
        include: ['src/**/*'],
    };
    fs_extra_1.default.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
    fs_extra_1.default.writeFileSync(path.join(projectPath, '.prettierrc'), JSON.stringify({ singleQuote: true, semi: false }, null, 2));
    fs_extra_1.default.writeFileSync(path.join(projectPath, '.eslintrc.json'), JSON.stringify({ env: { node: true, es6: true }, extends: 'eslint:recommended', rules: {} }, null, 2));
    vscode.window.showInformationMessage(`Project ${projectName} created successfully!`);
});
//# sourceMappingURL=createNewExpressProject.js.map