import type { Currency } from "#/types";

export type CreateProductPayload = {
	/** @description Name of product */
	name: string;
	/** @description Description of product */
	description: string;
	/**
	 * @description Price should be in the subunit of the supported currency
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	price: number;
	/**
	 * @description Currency in which price is set
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	currency: Currency;
	/** @description Set to `true` if the product has unlimited stock. Leave as `false` if the product has limited stock */
	unlimited?: boolean;
	/** @description Number of products in stock. Use if `unlimited` is `false` */
	quantity?: number;
	metadata?: Record<string, unknown>;
};

export type Product = {
	name: string;
	description: string;
	currency: Currency;
	price: number;
	quantity: number;
	is_shippable: boolean;
	unlimited: boolean;
	integration: number;
	domain: string;
	metadata: Record<string, unknown>;
	slug: string;
	product_code: `PROD_${string}`;
	quantity_sold: number;
	type: string;
	shipping_fields: Record<string, unknown>;
	active: boolean;
	in_stock: boolean;
	minimum_orderable: number;
	maximum_orderable: string | null;
	low_stock_alert: boolean;
	id: number;
	createdAt: string;
	updatedAt: string;
};

export type CreateProductResponsePayload = {
	status: boolean;
	message: string;
	data: Product;
};

export type ListProductPayload = {
	/**
	 * @description Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
	 */
	perPage?: number;
	/**
	 * @description Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
	 */
	page?: number;
	/**
	 * @description A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	from?: string | Date;
	/**
	 * @description A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	to?: string | Date;
};

type ProductMeta = {
	total: number;
	skipped: number;
	perPage: number;
	page: number;
	pageCount: number;
};

export type ListProductResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<
		Product[] &
			{
				file: Record<string, unknown>[];
				success_message: string | null;
				redirect_url: string | null;
				notification_emails: string | null;
				digital_assets: unknown[];
				variant_options: unknown[];
			}[]
	>;
	meta: ProductMeta;
};

export type FetchProductResponsePayload = {
	status: boolean;
	message: string;
	data: Product & {
		file: Record<string, unknown>[];
		success_message: string | null;
		redirect_url: string | null;
		notification_emails: string | null;
		digital_assets: unknown[];
		variant_options: unknown[];
		stock_threshold: string | null;
		features: string | null;
		expires_in: string | null;
	};
};

export type UpdateProductPayload = {
	/** @description Product ID */
	id: string;
} & CreateProductPayload;

export type UpdateProductResponsePayload = {
	status: boolean;
	message: string;
	data: Product & {
		image_path: string;
		file_path: string;
	};
};

export type CreateProductClient = {};
