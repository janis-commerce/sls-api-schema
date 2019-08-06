'use strict';

const sandbox = require('sinon').createSandbox();

const { ApiResponse } = require('@janiscommerce/sls-api-response');
const { ApiSchema } = require('@janiscommerce/api-schema');

const { SlsApiSchema } = require('..');

describe('SlsApiBrowse', () => {

	describe('Handler', () => {

		afterEach(() => {
			sandbox.restore();
		});

		it('Should set the path parameters to the Api Schema', async () => {

			const apiSchemaStub = sandbox.stub(ApiSchema.prototype);
			apiSchemaStub.validate.resolves();
			apiSchemaStub.process.resolves({ code: 200, body: {} });

			const setterSpy = sandbox.spy(apiSchemaStub, 'pathParameters', ['set']);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			await SlsApiSchema.handler({
				path: {
					entity: 'some-entity',
					action: 'some-action'
				}
			});

			sandbox.assert.calledOnce(apiSchemaStub.validate);
			sandbox.assert.calledOnce(apiSchemaStub.process);

			sandbox.assert.calledOnce(setterSpy.set);
			sandbox.assert.calledWithExactly(setterSpy.set, {
				entity: 'some-entity',
				action: 'some-action'
			});

			sandbox.assert.calledOnce(apiResponseStub);
		});

		it('Should return a 404 error if validate method fails', async () => {

			const apiSchemaStub = sandbox.stub(ApiSchema.prototype);
			apiSchemaStub.validate.rejects(new Error('Schema not found'));
			apiSchemaStub.process.resolves({ code: 200, body: {} });

			const setterSpy = sandbox.spy(apiSchemaStub, 'pathParameters', ['set']);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			await SlsApiSchema.handler({
				path: {
					entity: 'some-entity',
					action: 'some-action'
				}
			});

			sandbox.assert.calledOnce(apiSchemaStub.validate);
			sandbox.assert.notCalled(apiSchemaStub.process);

			sandbox.assert.calledOnce(setterSpy.set);
			sandbox.assert.calledWithExactly(setterSpy.set, {
				entity: 'some-entity',
				action: 'some-action'
			});

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 404,
				body: {
					message: 'Schema not found'
				}
			});
		});

		it('Should return a 200 and the schema if validate method passes', async () => {

			const apiSchemaStub = sandbox.stub(ApiSchema.prototype);
			apiSchemaStub.validate.resolves();
			apiSchemaStub.process.resolves({ body: { imA: 'schema' } });

			const setterSpy = sandbox.spy(apiSchemaStub, 'pathParameters', ['set']);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			await SlsApiSchema.handler({
				path: {
					entity: 'some-entity',
					action: 'some-action'
				}
			});

			sandbox.assert.calledOnce(apiSchemaStub.validate);
			sandbox.assert.calledOnce(apiSchemaStub.process);

			sandbox.assert.calledOnce(setterSpy.set);
			sandbox.assert.calledWithExactly(setterSpy.set, {
				entity: 'some-entity',
				action: 'some-action'
			});

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: undefined,
				body: { imA: 'schema' }
			});
		});
	});
});
