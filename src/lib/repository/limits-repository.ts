import { supabase } from "@/integrations/supabase/client";

export interface LimitsEntity {
  id?: string;
  key: string;
  name: string;
  description: string;
}

export interface PlanLimitsEntity {
  plan_id: string;
  limit_id: string;
  value: number;
}

const DATABASE_NAME: string = "limits";
const RELATION_DATABASE_NAME: string = "plan_limits";

export const LimitsRepository = {
  findAll: async (): Promise<LimitsEntity[]> => {
    const { data: features, error } = await supabase.from(DATABASE_NAME).select();

    if (error) {
      console.error("An error has occurred while find all plans features. ERROR: ", error);
      throw error;
    }

    return features;
  },
  findById: async (id: string): Promise<LimitsEntity> => {
    const { data: feature, error } = await supabase.from(DATABASE_NAME).select().eq('id', id).single();

    if (error) {
      console.error("An error has occurred while find a feature by id. ERROR: ", error);
      throw error;
    }

    return feature;
  },
  findByPlanId: async (planId: string): Promise<LimitsEntity[]> => {
    const planLimits: PlanLimitsEntity[] = await PlansLimitsRepository.findByPlanId(planId);
    const limits: LimitsEntity[] = [];

    for (const limit of planLimits) {
      limits.push(await LimitsRepository.findById(limit.limit_id));
    }

    return limits;
  }
};

export const PlansLimitsRepository = {
  findByPlanId: async (planId: string): Promise<PlanLimitsEntity[]> => {
    const {data: planFeature, error: planFeatureError} = await supabase.from(RELATION_DATABASE_NAME).select().eq('plan_id', planId)

    if (planFeatureError) {
      console.error("An error has occurred while find a feature plan. ERROR: ", planFeatureError);
    }

    return planFeature;
  },
  findByFeatureId: async (featureId: string): Promise<PlanLimitsEntity[]> => {
    const {data: planFeature, error: planFeatureError} = await supabase.from(RELATION_DATABASE_NAME).select().eq('feature_id', featureId);

    if (planFeatureError) {
      console.error("An error has occurred while find a feature plan. ERROR: ", planFeatureError);
    }

    return planFeature;
  },
  save: async (planFeature: PlanLimitsEntity): Promise<PlanLimitsEntity> => {
    const { data: planFeatureSaved, error } = await supabase.from(RELATION_DATABASE_NAME).insert(planFeature).select().single();

    if (error) {
      console.error("An error has occurred while save a plan / feature relation. ERROR: ", error);
      throw error;
    }

    return planFeatureSaved;
  },
  update: async (planId: string, limits: PlanLimitsEntity[]): Promise<void> => {
    const { data: deleteLimitFeature, error: deletePlanLimitError } = await supabase.from(RELATION_DATABASE_NAME).delete().eq('plan_id', planId);

    if (deletePlanLimitError) {
      console.error("An error has occurred while features limits. ERROR: ", deletePlanLimitError);
      throw deletePlanLimitError;
    }

    const { data, error } = await supabase.from(RELATION_DATABASE_NAME).insert(limits);

    if (error) {
      console.error("An error has occurred while update limits plan. UPDATE::ERROR: ", error);
      throw error;
    }
  }
};