import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ModuleFile {
  name: string;
  content: string;
}

class ModuleGenerator {
  private readonly rootPath: string;
  private readonly srcPath: string;

  constructor(workspacePath: string | undefined) {
    if (!workspacePath) {
      throw new Error('No workspace found');
    }
    this.rootPath = workspacePath;
    this.srcPath = path.join(this.rootPath, 'src', 'app', 'modules');
  }

  private toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }


  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split('')
      .map((char, index) => index === 0 ? char.toUpperCase() : char)
      .join('');
  }

  private toUpperCaseFirstChar(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateFiles(moduleName: string): ModuleFile[] {
    const camelCaseName = this.toCamelCase(moduleName);
    const titleCaseName = this.toTitleCase(camelCaseName);

    return [
      {
        name: `${camelCaseName}.interface.ts`,
        content: `export interface I${titleCaseName} {
  isDeleted: boolean;
  // Add your interface properties here
}
`,
      },
      {
        name: `${camelCaseName}.model.ts`,
        content: `import { model, Schema } from 'mongoose';
import { I${titleCaseName} } from './${camelCaseName}.interface';

const ${camelCaseName}Schema = new Schema<I${titleCaseName}>(
  {
    // Add your schema fields here
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// pre save middleware/hook
${camelCaseName}Schema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
${camelCaseName}Schema.post('save', function (doc, next) {
  next();
});

${camelCaseName}Schema.pre('updateOne', async function (next) {
  next();
});
export const ${titleCaseName} = model<I${titleCaseName}>('${titleCaseName}', ${camelCaseName}Schema);
`,
      },
      {
        name: `${camelCaseName}.constant.ts`,
        content: `export const ${camelCaseName}SearchableFields = [];
export const ${camelCaseName}FilterableFields = [];
`,
      },
      {
        name: `${camelCaseName}.validation.ts`,
        content: `import { z } from 'zod';

const create${this.toUpperCaseFirstChar(camelCaseName)}Schema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

const update${this.toUpperCaseFirstChar(camelCaseName)}Schema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

export const ${camelCaseName}Validations = {
  create${this.toUpperCaseFirstChar(camelCaseName)}Schema,
  update${this.toUpperCaseFirstChar(camelCaseName)}Schema,
};
`,
      },
      {
        name: `${camelCaseName}.service.ts`,
        content: `import { I${titleCaseName} } from './${camelCaseName}.interface';
import { ${titleCaseName} } from './${camelCaseName}.model';

const createOneIntoDB = async (payload: I${titleCaseName}): Promise<I${titleCaseName}> => {
  const result = await ${titleCaseName}.create(payload);
  return result;
};

const getAllFromDB = async (): Promise<I${titleCaseName}[]> => {
  const result = await ${titleCaseName}.find();
  return result;
};

const getOneFromDB = async (id: string): Promise<I${titleCaseName} | null> => {
  const result = await ${titleCaseName}.findById(id);
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<I${titleCaseName}>
): Promise<I${titleCaseName} | null> => {
  const result = await ${titleCaseName}.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<I${titleCaseName} | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ${camelCaseName}Services = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
`,
      },
      {
        name: `${camelCaseName}.controller.ts`,
        content: `import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ${camelCaseName}Services } from './${camelCaseName}.service';

const createOne = catchAsync(async (req, res) => {
  const result = await ${camelCaseName}Services.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${titleCaseName} created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await ${camelCaseName}Services.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${titleCaseName}s retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await ${camelCaseName}Services.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${titleCaseName} retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await ${camelCaseName}Services.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${titleCaseName} updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await ${camelCaseName}Services.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${titleCaseName} deleted successfully',
    data: result,
  });
});

export const ${camelCaseName}Controllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
`,
      },
      {
        name: `${camelCaseName}.route.ts`,
        content: `import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ${camelCaseName}Controllers } from './${camelCaseName}.controller';
import { ${camelCaseName}Validations } from './${camelCaseName}.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(${camelCaseName}Validations.create${this.toUpperCaseFirstChar(camelCaseName)}Schema),
  ${camelCaseName}Controllers.createOne,
);

router.get('/', ${camelCaseName}Controllers.getAll);
router.get('/:id', ${camelCaseName}Controllers.getOne);

router.patch(
  '/:id',
  validateRequest(${camelCaseName}Validations.update${this.toUpperCaseFirstChar(camelCaseName)}Schema),
  ${camelCaseName}Controllers.updateOne,
);

router.delete('/:id', ${camelCaseName}Controllers.deleteOne);

export const ${camelCaseName}Routes = router;
`,
      },
    ];
  }

  public async createModule(moduleName: string): Promise<void> {
    try {
      // Ensure src directory exists
      this.ensureDirectoryExists(this.srcPath);

      // Create module directory
      const modulePath = path.join(this.srcPath, this.toCamelCase(moduleName));
      this.ensureDirectoryExists(modulePath);

      // Generate and write files
      const files = this.generateFiles(moduleName);
      for (const file of files) {
        const filePath = path.join(modulePath, file.name);
        fs.writeFileSync(filePath, file.content);
      }

      vscode.window.showInformationMessage(`Module ${moduleName} created successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`Failed to create module: ${errorMessage}`);
      throw error;
    }
  }
}

export const createNewModule = vscode.commands.registerCommand(
  'modular-express.createNewModule',
  async () => {
    try {
      const moduleName = await vscode.window.showInputBox({
        prompt: 'Enter the module name',
        validateInput: (input) => (input ? null : 'Module name cannot be empty'),
      });

      if (!moduleName) {
        return;
      }

      const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      const generator = new ModuleGenerator(workspacePath);
      await generator.createModule(moduleName);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`Error creating module: ${errorMessage}`);
    }
  }
);