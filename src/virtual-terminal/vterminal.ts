import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import type { ListTerminalPayload } from "../terminal";
import {
	AddSplitCodePayloadSchema,
	AssignDestinationPayloadSchema,
	CreateVirtualTerminalSchemaPayload,
	ListVirtualTerminalPayloadSchema,
	UnAssignDestinationPayloadSchema,
} from "./schema";
import type {
	AddSplitCodePayload,
	AddSplitCodeResponsePayload,
	AssignDestinationPayload,
	AssignDestinationResponsePayload,
	CreateVirtualTerminalPayload,
	CreateVirtualTerminalResponsePayload,
	ListVirtualTerminalResponsePayload,
	UnAssignDestinationPayload,
} from "./types";

export const createVirtualTerminal = (instance: KyInstance) => {
	const create = async (payload: CreateVirtualTerminalPayload) => {
		const data = CreateVirtualTerminalSchemaPayload.parse(payload);
		return await instance
			.post("virtual_terminal", {
				json: data,
			})
			.json<CreateVirtualTerminalResponsePayload>();
	};

	const list = async (payload: ListTerminalPayload) => {
		const data = ListVirtualTerminalPayloadSchema.parse(payload);
		return await instance
			.get("virtual_terminal", {
				searchParams: data,
			})
			.json<ListVirtualTerminalResponsePayload>();
	};

	const fetch = async (payload: {
		/** @description Code of the Virtual Terminal */
		code: string;
	}) => {
		const data = z
			.object({
				code: z.string(),
			})
			.parse(payload);
		return await instance
			.get(`virtual_terminal/${data.code}`)
			.json<CreateVirtualTerminalResponsePayload>();
	};

	const update = async (payload: {
		/** @description Code of the Virtual Terminal to update */
		code: string;
		/** @description Name of the Virtual Terminal */
		name: string;
	}) => {
		const parse = z
			.object({
				code: z.string(),
				name: z.string(),
			})
			.parse(payload);
		const { code, ...rest } = parse;
		return await instance
			.put(`virtual_terminal/${code}`, {
				json: rest,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const deactivate = async (payload: {
		/** @description Code of the Virtual Terminal to deactivate */
		code: string;
	}) => {
		const parse = z
			.object({
				code: z.string(),
			})
			.parse(payload);
		return await instance
			.put(`virtual_terminal/${parse.code}/deactivate`)
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const assignDestination = async (payload: AssignDestinationPayload) => {
		const parse = AssignDestinationPayloadSchema.parse(payload);
		const { code, ...rest } = parse;
		return await instance
			.post(`virtual_terminal/${code}/destination/assign`, {
				json: rest,
			})
			.json<AssignDestinationResponsePayload>();
	};

	const unassignDestination = async (payload: UnAssignDestinationPayload) => {
		const parse = UnAssignDestinationPayloadSchema.parse(payload);
		const { code, ...rest } = parse;
		return await instance
			.post(`virtual_terminal/${code}/destination/unassign`, {
				json: rest,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const addSplitCode = async (payload: AddSplitCodePayload) => {
		const parse = AddSplitCodePayloadSchema.parse(payload);
		const { code, ...rest } = parse;
		return await instance
			.put(`virtual_terminal/${code}/split_code`, {
				json: rest,
			})
			.json<AddSplitCodeResponsePayload>();
	};

	const removeSplitCode = async (payload: AddSplitCodePayload) => {
		const parse = AddSplitCodePayloadSchema.parse(payload);
		const { code, ...rest } = parse;
		return await instance
			.delete(`virtual_terminal/${code}/split_code`, {
				json: rest,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	return {
		create,
		list,
		fetch,
		update,
		deactivate,
		assignDestination,
		unassignDestination,
		addSplitCode,
		removeSplitCode,
	};
};
