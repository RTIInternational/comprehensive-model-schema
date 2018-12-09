/* Demo formConfig */
// as constructed by ./demoSchema

const formConfig = {
  title: 'Diabetes Simulation Model',
  subTitle: 'Setup',
  formId: '',
  urlPrefix: '/',
  trackingPrefix: 'form-',
  submitUrl: 'https://www.google.com',
  confirmation: '',
  defaultDefinitions: {},
  chapters: {
    setup: {
      title: 'setup',
      pages: {
        basic_setup: {
          path: 'setup/basic_setup',
          title: 'basic_setup',
          schema: {
            type: 'object',
            properties: {
              equation_set: {
                type: 'string',
                minLength: 1,
                'enum': [
                  'ukpds',
                  't1d'
                ]
              },
              economics: {
                type: 'object',
                properties: {
                  discount: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    'default': 3
                  },
                  cost_strategy: {
                    type: 'string',
                    minLength: 1,
                    'default': 'ADDITIVE',
                    'enum': [
                      'ADDITIVE',
                      'MULTIPLICATIVE'
                    ]
                  },
                  intervention_cost: {
                    type: 'integer',
                    minimum: 0,
                    'default': 0
                  }
                }
              },
              scenario_name: {
                type: 'string',
                minLength: 1
              },
              population: {
                type: 'object',
                required: [
                  'size'
                ],
                properties: {
                  size: {
                    type: 'integer',
                    minimum: 0
                  }
                }
              },
              time_horizon: {
                type: 'object',
                required: [
                  'strategy',
                  'limit'
                ],
                properties: {
                  strategy: {
                    type: 'string',
                    minLength: 1,
                    'default': 'fixed',
                    'enum': [
                      'fixed',
                      'max_age',
                      'all_deceased'
                    ]
                  },
                  limit: {
                    type: 'integer',
                    minimum: 0,
                    'default': 0
                  }
                }
              }
            }
          },
          uiSchema: {
            'ui:title': 'Basic Setup',
            equation_set: {
              'ui:description': 'Name of the complication equation set to invoke.'
            },
            economics: {
              'ui:description': 'Cost Effectiveness configurations',
              'ui:order': [
                'discount',
                'cost_strategy',
                'intervention_cost'
              ],
              discount: {
                'ui:description': 'Discount factor.'
              },
              cost_strategy: {
                'ui:description': 'Cost calculation strategy.'
              },
              intervention_cost: {
                'ui:description': 'Cost of an intervention.'
              }
            },
            scenario_name: {
              'ui:description': 'Name of the scenario'
            },
            population: {
              'ui:description': 'Configurations for population generation.',
              size: {
                'ui:description': 'Number of individuals in the population.'
              }
            },
            time_horizon: {
              'ui:description': 'Simulation time horizon configuration.',
              'ui:order': [
                'strategy',
                'limit'
              ],
              strategy: {
                'ui:description': 'Time horizon execution strategy. \'fixed\' runs for a set duration. \'max_age\' runs until the youngest indidual reaches the max age. \'all_deceased\' runs until all agents have passed away.'
              },
              limit: {
                'ui:description': 'Time step limit. Refers to the maximum number of steps or maximum age, depending on context. Only applied in \'fixed\' and \'max_age\' strategies'
              }
            }
          },
          initialData: {
            equation_set: 'ukpds',
            population: {
              size: 100
            }
          }
        },
        ukpds_sensitivity_analysis: {
          path: 'setup/ukpds_sensitivity_analysis',
          title: 'ukpds_sensitivity_analysis',
          schema: {
            type: 'object',
            properties: {
              iterations: {
                type: 'integer',
                minimum: 0,
                'default': 0
              },
              interventions: {
                type: 'object',
                properties: {
                  risk_reductions: {
                    type: 'object',
                    properties: {
                      amputation: {
                        type: 'boolean'
                      },
                      csme: {
                        type: 'boolean'
                      },
                      cvd: {
                        type: 'boolean'
                      },
                      dka: {
                        type: 'boolean'
                      },
                      dpn: {
                        type: 'boolean'
                      },
                      esrd: {
                        type: 'boolean'
                      },
                      gfr: {
                        type: 'boolean'
                      },
                      hypoglycemia: {
                        type: 'boolean'
                      },
                      macroalbuminuria: {
                        type: 'boolean'
                      },
                      microalbuminuria: {
                        type: 'boolean'
                      },
                      npdr: {
                        type: 'boolean'
                      },
                      pdr: {
                        type: 'boolean'
                      },
                      ulcer: {
                        type: 'boolean'
                      }
                    }
                  },
                  factor_changes: {
                    type: 'object',
                    properties: {
                      bmi: {
                        type: 'boolean'
                      },
                      dbp: {
                        type: 'boolean'
                      },
                      sbp: {
                        type: 'boolean'
                      },
                      hba1c: {
                        type: 'boolean'
                      },
                      hdl: {
                        type: 'boolean'
                      },
                      ldl: {
                        type: 'boolean'
                      },
                      hr: {
                        type: 'boolean'
                      },
                      smoker: {
                        type: 'boolean'
                      },
                      insulin_dose: {
                        type: 'boolean'
                      },
                      trig: {
                        type: 'boolean'
                      }
                    }
                  }
                }
              }
            }
          },
          uiSchema: {
            'ui:title': 'ukpds_sensitivity_analysis',
            'ui:description': 'Configurations for Probabilitic Sensitivity Analysis.',
            'ui:order': [
              'iterations',
              'interventions'
            ],
            iterations: {
              'ui:description': 'Number of intervention simulations to conduct.'
            },
            interventions: {
              risk_reductions: {
                'ui:description': 'T1D specific complication risk reductions',
                amputation: {
                  'ui:description': 'Decrease risk of amputation.'
                },
                csme: {
                  'ui:description': 'Decrease risk of clinically significant macular edema.'
                },
                cvd: {
                  'ui:description': 'Decrease risk of cardiovascular disease.'
                },
                dka: {
                  'ui:description': 'Decrease risk of diabetic ketoacidosis.'
                },
                dpn: {
                  'ui:description': 'Decrease risk of dermatosis papulosa nigra.'
                },
                esrd: {
                  'ui:description': 'Decrease risk of end-stage renal disease.'
                },
                gfr: {
                  'ui:description': 'Decrease risk of GFR.'
                },
                hypoglycemia: {
                  'ui:description': 'Decrease risk of hypoglycemia.'
                },
                macroalbuminuria: {
                  'ui:description': 'Decrease risk of macroalbuminuria.'
                },
                microalbuminuria: {
                  'ui:description': 'Decrease risk of microalbuminuria.'
                },
                npdr: {
                  'ui:description': 'Decrease risk of nonproliferative diabetic retinopathy.'
                },
                pdr: {
                  'ui:description': 'Decrease risk of proliferative diabetic retinopathy.'
                },
                ulcer: {
                  'ui:description': 'Decrease risk of ulcers.'
                }
              },
              factor_changes: {
                'ui:description': 'T1D specific risk factor adjustments',
                bmi: {
                  'ui:description': 'Change population BMI characteristics.'
                },
                dbp: {
                  'ui:description': 'Change population diastolic blood pressure characteristics.'
                },
                sbp: {
                  'ui:description': 'Change population systolic blood pressure characteristics.'
                },
                hba1c: {
                  'ui:description': 'Change population HbA1c characteristics.'
                },
                hdl: {
                  'ui:description': 'Change population HDL characteristics.'
                },
                ldl: {
                  'ui:description': 'Change population LDL characteristics.'
                },
                hr: {
                  'ui:description': 'Change population heart rate characteristics.'
                },
                smoker: {
                  'ui:description': 'Change population smoking characteristics.'
                },
                insulin_dose: {
                  'ui:description': 'Change population insulin dose characteristics.'
                },
                trig: {
                  'ui:description': 'Change population triglyceride characteristics.'
                }
              }
            }
          },
          depends: {
            equation_set: 'ukpds'
          }
        },
        t1d_sensitivity_analysis: {
          path: 'setup/t1d_sensitivity_analysis',
          title: 't1d_sensitivity_analysis',
          schema: {
            type: 'object',
            properties: {
              iterations: {
                type: 'integer',
                minimum: 0,
                'default': 0
              },
              interventions: {
                type: 'object',
                properties: {
                  risk_reductions: {
                    type: 'object',
                    properties: {
                      amputation: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      csme: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      cvd: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      dka: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      dpn: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      esrd: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      gfr: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      hypoglycemia: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      macroalbuminuria: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      microalbuminuria: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      npdr: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      pdr: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      },
                      ulcer: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100
                      }
                    }
                  },
                  factor_changes: {
                    type: 'object',
                    properties: {
                      bmi: {
                        type: 'number'
                      },
                      dbp: {
                        type: 'number'
                      },
                      sbp: {
                        type: 'number'
                      },
                      hba1c: {
                        type: 'number'
                      },
                      hdl: {
                        type: 'number'
                      },
                      ldl: {
                        type: 'number'
                      },
                      hr: {
                        type: 'number'
                      },
                      smoker: {
                        type: 'number'
                      },
                      insulin_dose: {
                        type: 'number'
                      },
                      trig: {
                        type: 'number'
                      }
                    }
                  }
                }
              }
            }
          },
          uiSchema: {
            'ui:title': 't1d_sensitivity_analysis',
            'ui:description': 'Configurations for Probabilitic Sensitivity Analysis.',
            'ui:order': [
              'iterations',
              'interventions'
            ],
            iterations: {
              'ui:description': 'Number of intervention simulations to conduct.'
            },
            interventions: {
              risk_reductions: {
                'ui:description': 'T1D specific complication risk reductions',
                amputation: {
                  'ui:description': 'Decrease risk of amputation.'
                },
                csme: {
                  'ui:description': 'Decrease risk of clinically significant macular edema.'
                },
                cvd: {
                  'ui:description': 'Decrease risk of cardiovascular disease.'
                },
                dka: {
                  'ui:description': 'Decrease risk of diabetic ketoacidosis.'
                },
                dpn: {
                  'ui:description': 'Decrease risk of dermatosis papulosa nigra.'
                },
                esrd: {
                  'ui:description': 'Decrease risk of end-stage renal disease.'
                },
                gfr: {
                  'ui:description': 'Decrease risk of GFR.'
                },
                hypoglycemia: {
                  'ui:description': 'Decrease risk of hypoglycemia.'
                },
                macroalbuminuria: {
                  'ui:description': 'Decrease risk of macroalbuminuria.'
                },
                microalbuminuria: {
                  'ui:description': 'Decrease risk of microalbuminuria.'
                },
                npdr: {
                  'ui:description': 'Decrease risk of nonproliferative diabetic retinopathy.'
                },
                pdr: {
                  'ui:description': 'Decrease risk of proliferative diabetic retinopathy.'
                },
                ulcer: {
                  'ui:description': 'Decrease risk of ulcers.'
                }
              },
              factor_changes: {
                'ui:description': 'T1D specific risk factor adjustments',
                bmi: {
                  'ui:description': 'Change population BMI characteristics.'
                },
                dbp: {
                  'ui:description': 'Change population diastolic blood pressure characteristics.'
                },
                sbp: {
                  'ui:description': 'Change population systolic blood pressure characteristics.'
                },
                hba1c: {
                  'ui:description': 'Change population HbA1c characteristics.'
                },
                hdl: {
                  'ui:description': 'Change population HDL characteristics.'
                },
                ldl: {
                  'ui:description': 'Change population LDL characteristics.'
                },
                hr: {
                  'ui:description': 'Change population heart rate characteristics.'
                },
                smoker: {
                  'ui:description': 'Change population smoking characteristics.'
                },
                insulin_dose: {
                  'ui:description': 'Change population insulin dose characteristics.'
                },
                trig: {
                  'ui:description': 'Change population triglyceride characteristics.'
                }
              }
            }
          },
          depends: {
            equation_set: 't1d'
          }
        },
        ukpds_intervention_sets: {
          path: 'setup/ukpds_intervention_sets',
          title: 'ukpds_intervention_sets',
          schema: {
            type: 'object',
            properties: {
              ukpds_intervention_sets: {
                type: 'array',
                depends: {
                  and: {
                    equation_set: 'ukpds',
                    iterations: 0
                  }
                },
                items: {
                  properties: {
                    intervention_set_name: {
                      type: 'string'
                    },
                    risk_reductions: {
                      type: 'object',
                      properties: {
                        blindness: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        first_amputation: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        first_chf: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        first_ihd: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        first_mi: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        first_stroke: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        renal_failure: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        second_amputation: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        second_mi: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        second_stroke: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        ulcer: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        }
                      }
                    },
                    factor_changes: {
                      type: 'object',
                      properties: {
                        smoker: {
                          type: 'number'
                        },
                        mmalb: {
                          type: 'number'
                        },
                        pvd: {
                          type: 'number'
                        },
                        bmi: {
                          type: 'number'
                        },
                        hr: {
                          type: 'number'
                        },
                        hdl: {
                          type: 'number'
                        },
                        ldl: {
                          type: 'number'
                        },
                        sbp: {
                          type: 'number'
                        },
                        wbc: {
                          type: 'number'
                        },
                        hba1c: {
                          type: 'number'
                        },
                        haem: {
                          type: 'number'
                        },
                        egfr: {
                          type: 'number'
                        }
                      }
                    }
                  },
                  type: 'object',
                  'ui:order': [
                    'risk_reductions',
                    'factor_changes'
                  ]
                }
              }
            }
          },
          uiSchema: {
            'ui:title': 'ukpds_intervention_sets',
            ukpds_intervention_sets: {
              'ui:title': 'UKPDS Intervention Sets',
              'ui:description': 'For multiple intervention sets, click the "Add Another" button below.',
              'ui:options': {},
              items: {
                factor_changes: {
                  'ui:description': 'UKPDS specific risk factor adjustments',
                  smoker: {
                    'ui:description': 'Change population smoking characteristics.'
                  },
                  mmalb: {
                    'ui:description': 'Change population microalbuminuria characteristics.'
                  },
                  pvd: {
                    'ui:description': 'Change population peripheral vascular disease characteristics.'
                  },
                  bmi: {
                    'ui:description': 'Change population BMI characteristics.'
                  },
                  hr: {
                    'ui:description': 'Change population heart rate characteristics.'
                  },
                  hdl: {
                    'ui:description': 'Change population HDL characteristics.'
                  },
                  ldl: {
                    'ui:description': 'Change population LDL characteristics.'
                  },
                  sbp: {
                    'ui:description': 'Change population systolic blood pressure characteristics.'
                  },
                  wbc: {
                    'ui:description': 'Change population white blood cell characteristics.'
                  },
                  hba1c: {
                    'ui:description': 'Change population HbA1c characteristics.'
                  },
                  haem: {
                    'ui:description': 'Change population haemoglobin characteristics.'
                  },
                  egfr: {
                    'ui:description': 'Change population eGFR characteristics.'
                  }
                }
              }
            }
          }
        },
        t1d_intervention_sets: {
          path: 'setup/t1d_intervention_sets',
          title: 't1d_intervention_sets',
          schema: {
            type: 'object',
            properties: {
              t1d_intervention_sets: {
                type: 'array',
                depends: {
                  and: {
                    iterations: 0,
                    equation_set: 't1d'
                  }
                },
                items: {
                  properties: {
                    risk_reductions: {
                      type: 'object',
                      properties: {
                        amputation: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        csme: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        cvd: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        dka: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        dpn: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        esrd: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        gfr: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        hypoglycemia: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        macroalbuminuria: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        microalbuminuria: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        npdr: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        pdr: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        ulcer: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        }
                      }
                    },
                    factor_changes: {
                      type: 'object',
                      properties: {
                        bmi: {
                          type: 'number'
                        },
                        dbp: {
                          type: 'number'
                        },
                        sbp: {
                          type: 'number'
                        },
                        hba1c: {
                          type: 'number'
                        },
                        hdl: {
                          type: 'number'
                        },
                        ldl: {
                          type: 'number'
                        },
                        hr: {
                          type: 'number'
                        },
                        smoker: {
                          type: 'number'
                        },
                        insulin_dose: {
                          type: 'number'
                        },
                        trig: {
                          type: 'number'
                        }
                      }
                    }
                  },
                  type: 'object',
                  'ui:order': [
                    'risk_reductions',
                    'factor_changes'
                  ]
                }
              }
            }
          },
          uiSchema: {
            'ui:title': 't1d_intervention_sets',
            t1d_intervention_sets: {
              'ui:title': 't1d intervention sets',
              'ui:description': 'T1D intervention sets.',
              'ui:options': {},
              items: {
                factor_changes: {
                  'ui:description': 'T1D specific risk factor adjustments',
                  bmi: {
                    'ui:description': 'Change population BMI characteristics.'
                  },
                  dbp: {
                    'ui:description': 'Change population diastolic blood pressure characteristics.'
                  },
                  sbp: {
                    'ui:description': 'Change population systolic blood pressure characteristics.'
                  },
                  hba1c: {
                    'ui:description': 'Change population HbA1c characteristics.'
                  },
                  hdl: {
                    'ui:description': 'Change population HDL characteristics.'
                  },
                  ldl: {
                    'ui:description': 'Change population LDL characteristics.'
                  },
                  hr: {
                    'ui:description': 'Change population heart rate characteristics.'
                  },
                  smoker: {
                    'ui:description': 'Change population smoking characteristics.'
                  },
                  insulin_dose: {
                    'ui:description': 'Change population insulin dose characteristics.'
                  },
                  trig: {
                    'ui:description': 'Change population triglyceride characteristics.'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
